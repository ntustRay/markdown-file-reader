import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { open } from '@tauri-apps/plugin-dialog';
import { readFile, size, writeFile } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';
import { hasUnsavedChanges } from '../../src/domain/Document';
import { FileService } from '../../src/services/FileService';

vi.mock('@tauri-apps/plugin-dialog');
vi.mock('@tauri-apps/plugin-fs');
vi.mock('@tauri-apps/api/core');

describe('FileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the current document when the system picker is cancelled', async () => {
    const service = new FileService();
    vi.mocked(open).mockResolvedValue(null);

    await expect(service.openDocument()).resolves.toBeNull();
    expect(service.getCurrentDocument()).toBeNull();
  });

  it('opens an Android content URI as the current document', async () => {
    const service = new FileService();
    const bytes = new TextEncoder().encode('# Guide');
    const uri = 'content://provider/document/primary%3ADownload%2Fguide.md';
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Android');
    vi.mocked(invoke)
      .mockResolvedValueOnce({ uri })
      .mockResolvedValueOnce({
        data: Buffer.from(bytes).toString('base64'),
        name: 'guide.md',
        size: bytes.byteLength,
      });

    const document = await service.openDocument();

    expect(document).toMatchObject({
      uri,
      name: 'guide.md',
      kind: 'markdown',
      draftContent: '# Guide',
    });
    expect(service.getCurrentDocument()).toBe(document);
    expect(open).not.toHaveBeenCalled();
    expect(invoke).toHaveBeenNthCalledWith(
      1,
      'plugin:android-content|open_document',
      {
        payload: {
          mimeTypes: ['text/markdown', 'text/x-markdown', 'text/plain'],
        },
      },
    );
    expect(size).not.toHaveBeenCalled();
    expect(readFile).not.toHaveBeenCalled();
  });

  it('keeps the current document when a replacement cannot be decoded', async () => {
    const service = new FileService();
    const firstUri = 'content://provider/first.md';
    const brokenUri = 'content://provider/broken.md';
    vi.mocked(open)
      .mockResolvedValueOnce(firstUri)
      .mockResolvedValueOnce(brokenUri);
    vi.mocked(invoke)
      .mockResolvedValueOnce(androidContentResponse('first.md', new TextEncoder().encode('# First')))
      .mockResolvedValueOnce(androidContentResponse('broken.md', new Uint8Array([0xc3, 0x28])));

    const first = await service.openDocument();
    await expect(service.openDocument()).rejects.toMatchObject({
      code: 'invalid-utf8',
    });

    expect(service.getCurrentDocument()).toBe(first);
  });

  it('writes the draft to the same URI and marks it saved after success', async () => {
    const service = new FileService();
    const uri = 'content://provider/guide.md';
    vi.mocked(open).mockResolvedValue(uri);
    vi.mocked(invoke)
      .mockResolvedValueOnce(androidContentResponse('guide.md', new TextEncoder().encode('# First')))
      .mockResolvedValueOnce(undefined);
    await service.openDocument();

    service.updateDraft('# Changed');
    const saved = await service.saveDocument();

    expect(invoke).toHaveBeenLastCalledWith(
      'plugin:android-content|write_content_uri',
      {
        payload: {
          uri,
          data: Buffer.from('# Changed').toString('base64'),
        },
      },
    );
    expect(writeFile).not.toHaveBeenCalled();
    expect(hasUnsavedChanges(saved)).toBe(false);
    expect(service.getCurrentDocument()).toBe(saved);
  });

  it('keeps the draft dirty when writing fails', async () => {
    const service = new FileService();
    vi.mocked(open).mockResolvedValue('content://provider/read-only.md');
    vi.mocked(invoke)
      .mockResolvedValueOnce(androidContentResponse('read-only.md', new TextEncoder().encode('# First')))
      .mockRejectedValueOnce(new Error('Read only'));
    await service.openDocument();
    service.updateDraft('# Unsaved');

    await expect(service.saveDocument()).rejects.toThrow('Read only');

    const current = service.getCurrentDocument();
    expect(current).not.toBeNull();
    expect(current && hasUnsavedChanges(current)).toBe(true);
    expect(current?.draftContent).toBe('# Unsaved');
  });
});

function androidContentResponse(name: string, bytes: Uint8Array) {
  return {
    data: Buffer.from(bytes).toString('base64'),
    name,
    size: bytes.byteLength,
  };
}
