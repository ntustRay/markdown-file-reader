import { describe, expect, it } from 'vitest';
import {
  decodeDocument,
  DocumentError,
  hasUnsavedChanges,
  markDocumentSaved,
  MAX_DOCUMENT_BYTES,
  serializeDocument,
  updateDocumentDraft,
} from '../../src/domain/Document';

describe('decodeDocument', () => {
  it('opens a UTF-8 Markdown file as a clean document', () => {
    const bytes = new TextEncoder().encode('# Title\r\nBody\r\n');

    const document = decodeDocument({
      uri: 'content://documents/guide.md',
      name: 'guide.md',
      bytes,
    });

    expect(document).toEqual({
      uri: 'content://documents/guide.md',
      name: 'guide.md',
      kind: 'markdown',
      savedContent: '# Title\nBody\n',
      draftContent: '# Title\nBody\n',
      hasUtf8Bom: false,
      lineEnding: 'crlf',
    });
  });

  it('opens a .txt file as plain text', () => {
    const document = decodeDocument({
      uri: 'content://documents/notes.txt',
      name: 'notes.txt',
      bytes: new TextEncoder().encode('# Not a heading'),
    });

    expect(document.kind).toBe('text');
  });

  it('records and removes a UTF-8 BOM from editable content', () => {
    const content = new TextEncoder().encode('# Title');
    const bytes = new Uint8Array([0xef, 0xbb, 0xbf, ...content]);

    const document = decodeDocument({
      uri: 'content://documents/bom.md',
      name: 'bom.md',
      bytes,
    });

    expect(document.hasUtf8Bom).toBe(true);
    expect(document.draftContent).toBe('# Title');
  });

  it('rejects file types outside the public contract', () => {
    expect(() => decodeDocument({
      uri: 'content://documents/page.html',
      name: 'page.html',
      bytes: new TextEncoder().encode('<h1>Title</h1>'),
    })).toThrowError(new DocumentError(
      'unsupported-extension',
      'Only .md, .markdown, and .txt files are supported.',
    ));
  });

  it('rejects invalid UTF-8 without replacement characters', () => {
    expect(() => decodeDocument({
      uri: 'content://documents/legacy.md',
      name: 'legacy.md',
      bytes: new Uint8Array([0xc3, 0x28]),
    })).toThrowError(new DocumentError(
      'invalid-utf8',
      'This file is not valid UTF-8.',
    ));
  });

  it('rejects a file larger than 10 MB', () => {
    expect(() => decodeDocument({
      uri: 'content://documents/large.md',
      name: 'large.md',
      bytes: new Uint8Array(MAX_DOCUMENT_BYTES + 1),
    })).toThrowError(new DocumentError(
      'file-too-large',
      'Files larger than 10 MB are not supported.',
    ));
  });
});

describe('document editing', () => {
  it('is dirty only while the draft differs from the last saved content', () => {
    const original = decodeDocument({
      uri: 'content://documents/guide.md',
      name: 'guide.md',
      bytes: new TextEncoder().encode('# Original'),
    });

    const edited = updateDocumentDraft(original, '# Edited');
    const reverted = updateDocumentDraft(edited, '# Original');

    expect(hasUnsavedChanges(original)).toBe(false);
    expect(hasUnsavedChanges(edited)).toBe(true);
    expect(hasUnsavedChanges(reverted)).toBe(false);
  });

  it('restores the original BOM and CRLF convention when saving', () => {
    const originalBytes = new Uint8Array([
      0xef,
      0xbb,
      0xbf,
      ...new TextEncoder().encode('First\r\nSecond\r\n'),
    ]);
    const document = decodeDocument({
      uri: 'content://documents/windows.md',
      name: 'windows.md',
      bytes: originalBytes,
    });
    const edited = updateDocumentDraft(document, 'First\nChanged\n');

    expect(serializeDocument(edited)).toEqual(new Uint8Array([
      0xef,
      0xbb,
      0xbf,
      ...new TextEncoder().encode('First\r\nChanged\r\n'),
    ]));
  });

  it('becomes clean only when the caller confirms a successful save', () => {
    const document = decodeDocument({
      uri: 'content://documents/guide.md',
      name: 'guide.md',
      bytes: new TextEncoder().encode('# Original'),
    });
    const edited = updateDocumentDraft(document, '# Saved');

    expect(hasUnsavedChanges(edited)).toBe(true);
    expect(hasUnsavedChanges(markDocumentSaved(edited))).toBe(false);
  });

  it('rejects an edited draft that grows beyond 10 MB', () => {
    const document = decodeDocument({
      uri: 'content://documents/guide.md',
      name: 'guide.md',
      bytes: new TextEncoder().encode('# Small'),
    });
    const oversized = updateDocumentDraft(
      document,
      'a'.repeat(MAX_DOCUMENT_BYTES + 1),
    );

    expect(() => serializeDocument(oversized)).toThrowError(new DocumentError(
      'file-too-large',
      'Files larger than 10 MB are not supported.',
    ));
  });
});
