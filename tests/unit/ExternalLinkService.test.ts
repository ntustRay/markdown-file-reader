import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openUrl } from '@tauri-apps/plugin-opener';
import { openExternalUrl } from '../../src/services/ExternalLinkService';

vi.mock('@tauri-apps/plugin-opener');

describe('openExternalUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hands an HTTPS URL to the device default application', async () => {
    vi.mocked(openUrl).mockResolvedValue(undefined);

    await openExternalUrl('https://example.com/docs');

    expect(openUrl).toHaveBeenCalledWith('https://example.com/docs');
  });

  it('rejects a non-web URL before crossing the platform boundary', async () => {
    await expect(openExternalUrl('content://provider/private.md')).rejects.toThrow(
      'Only HTTP and HTTPS links can be opened.',
    );
    expect(openUrl).not.toHaveBeenCalled();
  });
});
