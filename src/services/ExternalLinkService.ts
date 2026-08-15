import { openUrl } from '@tauri-apps/plugin-opener';

export function isExternalWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export async function openExternalUrl(value: string): Promise<void> {
  if (!isExternalWebUrl(value)) {
    throw new Error('Only HTTP and HTTPS links can be opened.');
  }

  await openUrl(value);
}
