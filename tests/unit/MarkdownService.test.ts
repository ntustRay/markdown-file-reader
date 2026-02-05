import { describe, it, expect, beforeEach } from 'vitest';
import { MarkdownService } from '../../src/services/MarkdownService';

describe('MarkdownService', () => {
  let markdownService: MarkdownService;

  beforeEach(() => {
    markdownService = new MarkdownService();
  });

  describe('render', () => {
    it('應該渲染標題', async () => {
      const markdown = '# Hello World';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<h1');
      expect(html).toContain('Hello World');
    });

    it('應該渲染段落', async () => {
      const markdown = 'This is a paragraph.';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<p>');
      expect(html).toContain('This is a paragraph.');
    });

    it('應該渲染列表', async () => {
      const markdown = '- Item 1\n- Item 2';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
      expect(html).toContain('Item 1');
      expect(html).toContain('Item 2');
    });

    it('應該渲染程式碼區塊', async () => {
      const markdown = '```javascript\nconst x = 1;\n```';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<code');
      expect(html).toContain('const');
      expect(html).toContain('hljs');
    });

    it('應該渲染行內程式碼', async () => {
      const markdown = 'Use `const` instead of `var`.';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<code>');
      expect(html).toContain('const');
      expect(html).toContain('var');
    });

    it('應該渲染連結', async () => {
      const markdown = '[Google](https://google.com)';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<a');
      expect(html).toContain('href="https://google.com"');
      expect(html).toContain('Google');
    });

    it('應該渲染引用', async () => {
      const markdown = '> This is a quote';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<blockquote>');
      expect(html).toContain('This is a quote');
    });

    it('應該渲染表格', async () => {
      const markdown = '| Name | Age |\n|------|-----|\n| John | 30 |';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<table>');
      expect(html).toContain('<th>');
      expect(html).toContain('Name');
      expect(html).toContain('John');
    });

    it('應該支援 GFM 換行', async () => {
      const markdown = 'Line 1\nLine 2';
      const html = await markdownService.render(markdown);
      expect(html).toContain('Line 1');
      expect(html).toContain('Line 2');
    });


    it('應該渲染純文字內容並跳脫 HTML', () => {
      const html = markdownService.renderPlainText(`<script>alert(1)</script>\nline2`);
      expect(html).toContain('<pre class="plain-text-content">');
      expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
      expect(html).toContain('line2');
      expect(html).not.toContain('<script>alert(1)</script>');
    });



    it('應該移除惡意 HTML 標籤與事件屬性', async () => {
      const markdown = `<script>alert(1)</script>\n<img src="x" onerror="alert(2)">`;
      const html = await markdownService.render(markdown);

      expect(html).not.toContain('<script');
      expect(html).toContain('<img');
      expect(html).not.toContain('onerror=');
    });

    it('應該移除 javascript: 類型的連結', async () => {
      const markdown = `[Click me](javascript:alert(1))`;
      const html = await markdownService.render(markdown);

      expect(html).toContain('<a');
      expect(html).not.toContain('href="javascript:alert(1)"');
    });

    it('應該處理粗體和斜體', async () => {
      const markdown = '**bold** and *italic*';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<strong>');
      expect(html).toContain('bold');
      expect(html).toContain('<em>');
      expect(html).toContain('italic');
    });
  });

  describe('extractHeadings', () => {
    it('應該提取所有標題', async () => {
      const markdown = `# Heading 1
## Heading 2
### Heading 3
Some text
## Another H2`;

      const headings = await markdownService.extractHeadings(markdown);

      expect(headings).toHaveLength(4);
      expect(headings[0]).toEqual({ level: 1, text: 'Heading 1' });
      expect(headings[1]).toEqual({ level: 2, text: 'Heading 2' });
      expect(headings[2]).toEqual({ level: 3, text: 'Heading 3' });
      expect(headings[3]).toEqual({ level: 2, text: 'Another H2' });
    });

    it('應該在沒有標題時返回空陣列', async () => {
      const markdown = 'Just some text without headings.';
      const headings = await markdownService.extractHeadings(markdown);
      expect(headings).toEqual([]);
    });
  });
});
