import { beforeEach, describe, expect, it } from 'vitest';
import { MarkdownService } from '../../src/services/MarkdownService';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(() => {
    service = new MarkdownService();
  });

  it('shows unsupported raw HTML as source text', async () => {
    const html = await service.render('<script>alert(1)</script>');

    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('renders a remote image as an external text link without loading it', async () => {
    const html = await service.render('![Architecture](https://example.com/diagram.png)');

    expect(html).toContain('href="https://example.com/diagram.png"');
    expect(html).toContain('data-external-link');
    expect(html).toContain('Architecture');
    expect(html).not.toContain('<img');
  });

  it('renders a local image reference as non-actionable text', async () => {
    const html = await service.render('![Local diagram](./images/diagram.png)');

    expect(html).toContain('Local diagram');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<a');
    expect(html).not.toContain('src=');
  });

  it('marks only HTTP links for external opening', async () => {
    const safe = await service.render('[Docs](https://example.com/docs)');
    const unsafe = await service.render('[Run](javascript:alert(1))');

    expect(safe).toContain('href="https://example.com/docs"');
    expect(safe).toContain('data-external-link');
    expect(unsafe).toContain('Run');
    expect(unsafe).not.toContain('<a');
    expect(unsafe).not.toContain('javascript:');
  });

  it('blocks local, data, and custom URL schemes', async () => {
    const schemes = ['file:///tmp/a.md', 'content://provider/a', 'data:text/html,test', 'notes://open'];

    for (const href of schemes) {
      const html = await service.render(`[Blocked](${href})`);
      expect(html).toContain('Blocked');
      expect(html).not.toContain('<a');
      expect(html).not.toContain('data-external-link');
    }
  });

  it('renders the supported GFM reading surface', async () => {
    const html = await service.render(`# Guide

- [x] Ready

| Mode | Status |
| --- | --- |
| Preview | On |

> Local first`);

    expect(html).toContain('<h1');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('<table>');
    expect(html).toContain('<blockquote>');
  });

  it('keeps fenced-code syntax highlighting', async () => {
    const html = await service.render('```typescript\nconst ready = true;\n```');

    expect(html).toContain('class="hljs language-typescript"');
    expect(html).toContain('<span class="hljs-keyword">const</span>');
  });

  it('escapes plain text without Markdown formatting', () => {
    const html = service.renderPlainText('# Title\n<script>alert(1)</script>');

    expect(html).toContain('# Title');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<h1>');
    expect(html).not.toContain('<script>');
  });
});
