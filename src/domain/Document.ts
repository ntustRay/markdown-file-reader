export type DocumentKind = 'markdown' | 'text';
export type LineEnding = 'lf' | 'crlf';
export type DocumentErrorCode = 'unsupported-extension' | 'invalid-utf8' | 'file-too-large';
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

export class DocumentError extends Error {
  constructor(
    readonly code: DocumentErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DocumentError';
  }
}

export interface DocumentFile {
  uri: string;
  name: string;
  kind: DocumentKind;
  savedContent: string;
  draftContent: string;
  hasUtf8Bom: boolean;
  lineEnding: LineEnding;
}

interface DecodeDocumentInput {
  uri: string;
  name: string;
  bytes: Uint8Array;
}

export function decodeDocument(input: DecodeDocumentInput): DocumentFile {
  if (input.bytes.byteLength > MAX_DOCUMENT_BYTES) {
    throw new DocumentError(
      'file-too-large',
      'Files larger than 10 MB are not supported.',
    );
  }

  const lowerName = input.name.toLowerCase();
  const isText = lowerName.endsWith('.txt');
  const isMarkdown = lowerName.endsWith('.md') || lowerName.endsWith('.markdown');

  if (!isText && !isMarkdown) {
    throw new DocumentError(
      'unsupported-extension',
      'Only .md, .markdown, and .txt files are supported.',
    );
  }

  const hasUtf8Bom = input.bytes[0] === 0xef
    && input.bytes[1] === 0xbb
    && input.bytes[2] === 0xbf;
  let content: string;

  try {
    content = new TextDecoder('utf-8', { fatal: true }).decode(input.bytes);
  } catch {
    throw new DocumentError('invalid-utf8', 'This file is not valid UTF-8.');
  }
  const kind: DocumentKind = isText ? 'text' : 'markdown';
  const lineEnding: LineEnding = content.includes('\r\n') ? 'crlf' : 'lf';
  const normalizedContent = content.replace(/\r\n?/g, '\n');

  return {
    uri: input.uri,
    name: input.name,
    kind,
    savedContent: normalizedContent,
    draftContent: normalizedContent,
    hasUtf8Bom,
    lineEnding,
  };
}

export function updateDocumentDraft(
  document: DocumentFile,
  draftContent: string,
): DocumentFile {
  return { ...document, draftContent };
}

export function hasUnsavedChanges(document: DocumentFile): boolean {
  return document.draftContent !== document.savedContent;
}

export function markDocumentSaved(document: DocumentFile): DocumentFile {
  return { ...document, savedContent: document.draftContent };
}

export function serializeDocument(document: DocumentFile): Uint8Array {
  const normalizedContent = document.draftContent.replace(/\r\n?/g, '\n');
  const content = document.lineEnding === 'crlf'
    ? normalizedContent.replace(/\n/g, '\r\n')
    : normalizedContent;
  const encodedContent = new TextEncoder().encode(content);
  const byteLength = encodedContent.byteLength + (document.hasUtf8Bom ? 3 : 0);

  if (byteLength > MAX_DOCUMENT_BYTES) {
    throw new DocumentError(
      'file-too-large',
      'Files larger than 10 MB are not supported.',
    );
  }

  if (!document.hasUtf8Bom) {
    return encodedContent;
  }

  const bytes = new Uint8Array(encodedContent.byteLength + 3);
  bytes.set([0xef, 0xbb, 0xbf]);
  bytes.set(encodedContent, 3);
  return bytes;
}
