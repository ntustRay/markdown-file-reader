import { open } from '@tauri-apps/plugin-dialog';
import { readFile, size, writeFile } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';
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
    const selected = isAndroidRuntime()
      ? await openAndroidDocument()
      : await open({
          multiple: false,
          directory: false,
          filters: [
            {
              name: 'Markdown and text',
              extensions: ['md', 'markdown', 'txt'],
            },
          ],
        });

    if (selected === null) {
      return null;
    }

    if (Array.isArray(selected)) {
      throw new Error('Expected a single selected document.');
    }

    const { bytes, name } = isAndroidContentUri(selected)
      ? await readAndroidContentUri(selected)
      : await readLocalFile(selected);
    const document = decodeDocument({
      uri: selected,
      name,
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

    const bytes = serializeDocument(this.currentDocument);
    if (isAndroidContentUri(this.currentDocument.uri)) {
      await writeAndroidContentUri(this.currentDocument.uri, bytes);
    } else {
      await writeFile(this.currentDocument.uri, bytes);
    }
    this.currentDocument = markDocumentSaved(this.currentDocument);
    return this.currentDocument;
  }
}

interface OpenedFile {
  bytes: Uint8Array;
  name: string;
}

interface AndroidContentResponse {
  data: string;
  name: string;
  size: number;
}

async function openAndroidDocument(): Promise<string | null> {
  const response: unknown = await invoke('plugin:android-content|open_document', {
    payload: {
      mimeTypes: ['text/markdown', 'text/x-markdown', 'text/plain'],
    },
  });
  if (
    typeof response !== 'object' ||
    response === null ||
    !('uri' in response) ||
    (typeof response.uri !== 'string' && response.uri !== null)
  ) {
    throw new Error('Android returned an invalid document selection.');
  }
  return response.uri;
}

async function readLocalFile(uri: string): Promise<OpenedFile> {
  const byteLength = await size(uri);
  assertSupportedSize(byteLength);
  return {
    bytes: await readFile(uri),
    name: getDocumentName(uri),
  };
}

async function readAndroidContentUri(uri: string): Promise<OpenedFile> {
  let response: unknown;
  try {
    response = await invoke('plugin:android-content|read_content_uri', {
      payload: { uri, maxBytes: MAX_DOCUMENT_BYTES },
    });
  } catch (error: unknown) {
    if (
      error === 'file-too-large' ||
      (error instanceof Error && error.message === 'file-too-large')
    ) {
      throwFileTooLarge();
    }
    throw error;
  }

  if (!isAndroidContentResponse(response)) {
    throw new Error('Android returned an invalid document response.');
  }

  const bytes = decodeBase64(response.data);
  assertSupportedSize(response.size);
  if (bytes.byteLength !== response.size) {
    throw new Error('Android returned an incomplete document.');
  }
  return { bytes, name: response.name };
}

async function writeAndroidContentUri(uri: string, bytes: Uint8Array): Promise<void> {
  await invoke('plugin:android-content|write_content_uri', {
    payload: { uri, data: encodeBase64(bytes) },
  });
}

function isAndroidContentUri(uri: string): boolean {
  return uri.startsWith('content://');
}

function isAndroidRuntime(): boolean {
  return navigator.userAgent.includes('Android');
}

function isAndroidContentResponse(value: unknown): value is AndroidContentResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return (
    'data' in value &&
    typeof value.data === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.length > 0 &&
    'size' in value &&
    typeof value.size === 'number' &&
    Number.isSafeInteger(value.size) &&
    value.size >= 0
  );
}

function assertSupportedSize(byteLength: number): void {
  if (byteLength > MAX_DOCUMENT_BYTES) {
    throwFileTooLarge();
  }
}

function throwFileTooLarge(): never {
  throw new DocumentError(
    'file-too-large',
    'Files larger than 10 MB are not supported.',
  );
}

function decodeBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function encodeBase64(bytes: Uint8Array): string {
  const chunks: string[] = [];
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(offset, offset + chunkSize)));
  }
  return btoa(chunks.join(''));
}

function getDocumentName(uri: string): string {
  const decodedUri = decodeURIComponent(uri);
  return decodedUri.split(/[\\/]/).pop() ?? decodedUri;
}
