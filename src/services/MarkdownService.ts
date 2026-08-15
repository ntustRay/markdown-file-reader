import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import markdown from 'highlight.js/lib/languages/markdown';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('kt', kotlin);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('rs', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);

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
      marked.use({
        renderer: {
          html(html) {
            return escapeHtml(html);
          },
          image(href, _title, text) {
            const label = escapeHtml(text || href);
            if (!isSafeExternalUrl(href)) {
              return `<span class="image-reference">${label}</span>`;
            }
            return `<a class="image-reference image-reference-link" href="${escapeHtml(href)}" data-external-link rel="noopener noreferrer">${label}</a>`;
          },
          link(href, _title, text) {
            if (!isSafeExternalUrl(href)) {
              return text;
            }
            return `<a href="${escapeHtml(href)}" data-external-link rel="noopener noreferrer">${text}</a>`;
          },
        },
      });

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
      'button', 'textarea', 'select', 'style', 'link', 'meta'
    ];

    for (const tag of blockedTags) {
      for (const element of container.querySelectorAll(tag)) {
        element.remove();
      }
    }

    for (const element of container.querySelectorAll('*')) {
      for (const attr of Array.from(element.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim().toLowerCase();

        if (name.startsWith('on')) {
          element.removeAttribute(attr.name);
          continue;
        }

        if ((name === 'href' || name === 'src') && (
          value.startsWith('javascript:') ||
          value.startsWith('vbscript:') ||
          value.startsWith('data:')
        )) {
          element.removeAttribute(attr.name);
        }
      }
    }

    return container.innerHTML;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isSafeExternalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}
