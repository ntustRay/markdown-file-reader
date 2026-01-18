import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

export interface Heading {
  level: number;
  text: string;
}

export class MarkdownService {
  constructor() {
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
  }

  async render(markdown: string): Promise<string> {
    try {
      return await marked(markdown);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      throw error;
    }
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
