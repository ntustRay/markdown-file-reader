import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

export interface Heading {
  level: number;
  text: string;
}

export class MarkdownService {
  private static configured = false;

  constructor() {
    if (!MarkdownService.configured) {
      // Configure marked for GitHub Flavored Markdown
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      // Add syntax highlighting extension
      marked.use(markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language }).value;
        }
      }));

      MarkdownService.configured = true;
    }
  }

  async render(markdown: string): Promise<string> {
    try {
      const rendered = await marked(markdown);
      return this.sanitizeHtml(rendered);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      throw error;
    }
  }

  renderPlainText(content: string): string {
    const escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return `<pre class="plain-text-content">${escaped}</pre>`;
  }


  private sanitizeHtml(html: string): string {
    const container = document.createElement('div');
    container.innerHTML = html;

    const blockedTags = [
      'script', 'iframe', 'object', 'embed', 'form',
      'input', 'button', 'textarea', 'select', 'style', 'link', 'meta'
    ];

    blockedTags.forEach((tag) => {
      container.querySelectorAll(tag).forEach((element) => element.remove());
    });

    container.querySelectorAll('*').forEach((element) => {
      Array.from(element.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim().toLowerCase();

        if (name.startsWith('on')) {
          element.removeAttribute(attr.name);
          return;
        }

        if ((name === 'href' || name === 'src') && (
          value.startsWith('javascript:') || value.startsWith('data:text/html')
        )) {
          element.removeAttribute(attr.name);
        }
      });
    });

    return container.innerHTML;
  }

  async extractHeadings(markdown: string): Promise<Heading[]> {
    const headings: Heading[] = [];
    const lines = markdown.split('\n');

    for (const line of lines) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        headings.push({ level, text });
      }
    }

    return headings;
  }
}
