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

  describe('sanitization - XSS attack vectors', () => {
    it('應該移除 iframe 標籤', async () => {
      const markdown = '<iframe src="https://evil.com"></iframe>';
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('<iframe');
      expect(html).not.toContain('evil.com');
    });

    it('應該移除 object 和 embed 標籤', async () => {
      const markdown = '<object data="malware.swf"></object><embed src="malware.swf">';
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('<object');
      expect(html).not.toContain('<embed');
      expect(html).not.toContain('malware.swf');
    });

    it('應該移除 form 和 input 標籤', async () => {
      const markdown = '<form action="https://evil.com"><input type="text" name="password"></form>';
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('<form');
      expect(html).not.toContain('<input');
    });

    it('應該移除 style 標籤', async () => {
      const markdown = '<style>body { background: url("javascript:alert(1)") }</style>';
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('<style');
    });

    it('應該移除 link 和 meta 標籤', async () => {
      const markdown = '<link rel="stylesheet" href="evil.css"><meta http-equiv="refresh" content="0;url=evil.com">';
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('<link');
      expect(html).not.toContain('<meta');
    });

    it('應該移除各種事件處理器屬性', async () => {
      const markdown = `<div onclick="alert(1)" onmouseover="alert(2)" onload="alert(3)">test</div>`;
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('onclick');
      expect(html).not.toContain('onmouseover');
      expect(html).not.toContain('onload');
    });

    it('應該移除大小寫混合的事件處理器', async () => {
      const markdown = '<div onClick="alert(1)" ONMOUSEOVER="alert(2)">test</div>';
      const html = await markdownService.render(markdown);
      expect(html.toLowerCase()).not.toContain('onclick');
      expect(html.toLowerCase()).not.toContain('onmouseover');
    });

    it('應該移除 data:text/html URL', async () => {
      const markdown = '<a href="data:text/html,<script>alert(1)</script>">click</a>';
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('data:text/html');
    });

    it('應該保留安全的 data: URL (如圖片)', async () => {
      const markdown = '![img](data:image/png;base64,iVBORw0KGgo=)';
      const html = await markdownService.render(markdown);
      expect(html).toContain('<img');
      expect(html).toContain('data:image/png');
    });

    it('應該移除 javascript: URL 的各種變體', async () => {
      const testCases = [
        '[link](javascript:alert(1))',
        '[link](JAVASCRIPT:alert(1))',
        '[link](Javascript:alert(1))',
        '[link](  javascript:alert(1))',
      ];

      for (const markdown of testCases) {
        const html = await markdownService.render(markdown);
        expect(html.toLowerCase()).not.toContain('href="javascript:');
        expect(html.toLowerCase()).not.toContain("href='javascript:");
      }
    });

    it('應該移除 SVG 中的惡意內容', async () => {
      const markdown = '<svg onload="alert(1)"><script>alert(2)</script></svg>';
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('onload');
      expect(html).not.toContain('<script');
    });

    it('應該移除 textarea 和 select 標籤', async () => {
      const markdown = '<textarea>password</textarea><select><option>evil</option></select>';
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('<textarea');
      expect(html).not.toContain('<select');
    });

    it('應該移除 button 標籤', async () => {
      const markdown = '<button onclick="stealData()">Click me</button>';
      const html = await markdownService.render(markdown);
      expect(html).not.toContain('<button');
    });

    it('應該保留合法的 Markdown 內容', async () => {
      const markdown = `# Title

This is **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`javascript
const safe = true;
\`\`\`

[Safe link](https://example.com)
`;
      const html = await markdownService.render(markdown);
      expect(html).toContain('<h1');
      expect(html).toContain('<strong>');
      expect(html).toContain('<em>');
      expect(html).toContain('<ul>');
      expect(html).toContain('<code');
      expect(html).toContain('href="https://example.com"');
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
