import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Google Play release identity', () => {
  it('keeps the production name, package, and version aligned', () => {
    const packageManifest = readFileSync('package.json', 'utf8');
    const tauriConfig = readFileSync('src-tauri/tauri.conf.json', 'utf8');

    expect(packageManifest).toContain('"version": "1.0.0"');
    expect(tauriConfig).toContain('"productName": "Ray Markdown Reader"');
    expect(tauriConfig).toContain('"identifier": "com.ntustray.raymarkdownreader"');
    expect(tauriConfig).toContain('"version": "1.0.0"');
  });

  it('does not restore removed workspace UI or remote font requests', () => {
    const html = readFileSync('index.html', 'utf8');
    const removedPatterns = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'id="sidebar"',
      'id="open-folder"',
      'id="search-input"',
      'QuillTide',
      'MarkView',
    ];

    for (const pattern of removedPatterns) {
      expect(html).not.toContain(pattern);
    }
  });
});
