import { open } from '@tauri-apps/plugin-dialog';
import { readFile, size, writeFile } from '@tauri-apps/plugin-fs';
import {
  decodeDocument,
  DocumentError,
  markDocumentSaved,
  serializeDocument,
  type DocumentFile,
  MAX_DOCUMENT_BYTES,
  updateDocumentDraft,
} from '../domain/Document';

export class FileService {
  private currentDocument: DocumentFile | null = null;

  async openDocument(): Promise<DocumentFile | null> {
    const selected = await open({
      multiple: false,
      directory: false,
      filters: [{
        name: 'Markdown and text',
        extensions: ['md', 'markdown', 'txt'],
      }],
    });

    if (selected === null) {
      return null;
    }

    if (Array.isArray(selected)) {
      throw new Error('Expected a single selected document.');
    }

    const byteLength = await size(selected);
    if (byteLength > MAX_DOCUMENT_BYTES) {
      throw new DocumentError(
        'file-too-large',
        'Files larger than 10 MB are not supported.',
      );
    }

    const bytes = await readFile(selected);
    const document = decodeDocument({
      uri: selected,
      name: getDocumentName(selected),
      bytes,
    });
    this.currentDocument = document;
    return document;
  }

  getCurrentDocument(): DocumentFile | null {
    return this.currentDocument;
  }

  updateDraft(content: string): DocumentFile {
    if (this.currentDocument === null) {
      throw new Error('No document is open.');
    }

    this.currentDocument = updateDocumentDraft(this.currentDocument, content);
    return this.currentDocument;
  }

  async saveDocument(): Promise<DocumentFile> {
    if (this.currentDocument === null) {
      throw new Error('No document is open.');
    }

    await writeFile(this.currentDocument.uri, serializeDocument(this.currentDocument));
    this.currentDocument = markDocumentSaved(this.currentDocument);
    return this.currentDocument;
  }
}

function getDocumentName(uri: string): string {
  const decodedUri = decodeURIComponent(uri);
  return decodedUri.split(/[\\/]/).pop() ?? decodedUri;
}
