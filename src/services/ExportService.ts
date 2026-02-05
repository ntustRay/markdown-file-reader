import { errorService, ErrorCode } from './ErrorService';

export type ExportFormat = 'html' | 'markdown' | 'plaintext';

export interface ExportOptions {
  format: ExportFormat;
  includeStyles?: boolean;
  fileName?: string;
}

export class ExportService {
  // 匯出為 HTML
  async exportToHtml(content: string, renderedHtml: string, options: ExportOptions): Promise<string> {
    const styles = options.includeStyles ? this.getDefaultStyles() : '';

    const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.fileName || 'Exported Document'}</title>
  ${styles ? `<style>${styles}</style>` : ''}
</head>
<body>
  <article class="markdown-body">
    ${renderedHtml}
  </article>
</body>
</html>`;

    return html;
  }

  // 複製到剪貼簿
  async copyToClipboard(text: string, format: 'text' | 'html' = 'text'): Promise<void> {
    try {
      if (format === 'html' && navigator.clipboard.write) {
        const blob = new Blob([text], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({ 'text/html': blob });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        await navigator.clipboard.writeText(text);
      }

      errorService.logInfo('複製到剪貼簿成功', { format });
    } catch (error) {
      const appError = errorService.fromNativeError(
        error,
        ErrorCode.UNKNOWN_ERROR,
        { operation: 'copyToClipboard', format }
      );
      throw appError;
    }
  }

  // 下載檔案
  downloadFile(content: string, fileName: string, mimeType: string): void {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      errorService.logInfo('檔案下載成功', { fileName, mimeType });
    } catch (error) {
      const appError = errorService.fromNativeError(
        error,
        ErrorCode.UNKNOWN_ERROR,
        { operation: 'downloadFile', fileName }
      );
      throw appError;
    }
  }

  // 匯出並下載
  async exportAndDownload(
    markdownContent: string,
    renderedHtml: string,
    options: ExportOptions
  ): Promise<void> {
    const baseName = options.fileName?.replace(/\.[^.]+$/, '') || 'document';

    switch (options.format) {
      case 'html': {
        const html = await this.exportToHtml(markdownContent, renderedHtml, options);
        this.downloadFile(html, `${baseName}.html`, 'text/html');
        break;
      }
      case 'markdown': {
        this.downloadFile(markdownContent, `${baseName}.md`, 'text/markdown');
        break;
      }
      case 'plaintext': {
        // 從 HTML 提取純文字
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = renderedHtml;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        this.downloadFile(plainText, `${baseName}.txt`, 'text/plain');
        break;
      }
    }
  }

  // 預設樣式
  private getDefaultStyles(): string {
    return `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        color: #24292e;
      }
      .markdown-body h1, .markdown-body h2, .markdown-body h3,
      .markdown-body h4, .markdown-body h5, .markdown-body h6 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        font-weight: 600;
      }
      .markdown-body h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
      .markdown-body h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
      .markdown-body p { margin: 1em 0; }
      .markdown-body code {
        background: #f6f8fa;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 85%;
      }
      .markdown-body pre {
        background: #f6f8fa;
        padding: 1em;
        border-radius: 6px;
        overflow-x: auto;
      }
      .markdown-body pre code {
        background: none;
        padding: 0;
      }
      .markdown-body blockquote {
        border-left: 4px solid #dfe2e5;
        margin: 0;
        padding-left: 1em;
        color: #6a737d;
      }
      .markdown-body ul, .markdown-body ol {
        padding-left: 2em;
      }
      .markdown-body table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      .markdown-body th, .markdown-body td {
        border: 1px solid #dfe2e5;
        padding: 0.5em 1em;
      }
      .markdown-body th {
        background: #f6f8fa;
        font-weight: 600;
      }
      @media print {
        body { max-width: none; padding: 1cm; }
      }
    `;
  }
}
