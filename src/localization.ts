export type AppLocale = 'en' | 'zh-TW';

export interface Translations {
  appName: string;
  openFile: string;
  noFile: string;
  editorLabel: string;
  edit: string;
  preview: string;
  save: string;
  saving: string;
  emptyTitle: string;
  emptyHint: string;
  unsavedTitle: string;
  unsavedMessage: string;
  discard: string;
  cancel: string;
  close: string;
  fileTooLarge: string;
  invalidUtf8: string;
  unsupportedExtension: string;
  readFailed: string;
  writeFailed: string;
  linkFailed: string;
  themeLight: string;
  themeDark: string;
}

const translations: Record<AppLocale, Translations> = {
  en: {
    appName: 'Ray Markdown Reader',
    openFile: 'Open file',
    noFile: 'No file',
    editorLabel: 'Document editor',
    edit: 'Edit',
    preview: 'Preview',
    save: 'Save',
    saving: 'Saving…',
    emptyTitle: 'Open a Markdown file',
    emptyHint: 'Choose one .md, .markdown, or .txt file from your device.',
    unsavedTitle: 'Save your changes?',
    unsavedMessage: 'This file has changes that have not been saved.',
    discard: 'Discard',
    cancel: 'Cancel',
    close: 'Close',
    fileTooLarge: 'Files larger than 10 MB are not supported.',
    invalidUtf8: 'This file is not valid UTF-8.',
    unsupportedExtension: 'Only .md, .markdown, and .txt files are supported.',
    readFailed: 'This file could not be opened. Choose another file and try again.',
    writeFailed: 'Changes could not be saved. Your edits are still here.',
    linkFailed: 'This link could not be opened in your browser.',
    themeLight: 'Use light theme',
    themeDark: 'Use dark theme',
  },
  'zh-TW': {
    appName: 'Ray Markdown Reader',
    openFile: '開啟檔案',
    noFile: '尚未開啟檔案',
    editorLabel: '文件編輯器',
    edit: '編輯',
    preview: '預覽',
    save: '儲存',
    saving: '儲存中…',
    emptyTitle: '開啟 Markdown 檔案',
    emptyHint: '從裝置選擇一個 .md、.markdown 或 .txt 檔案。',
    unsavedTitle: '要儲存變更嗎？',
    unsavedMessage: '這個檔案有尚未儲存的變更。',
    discard: '不儲存',
    cancel: '取消',
    close: '關閉',
    fileTooLarge: '不支援超過 10 MB 的檔案。',
    invalidUtf8: '這個檔案不是有效的 UTF-8。',
    unsupportedExtension: '只支援 .md、.markdown 與 .txt 檔案。',
    readFailed: '無法開啟這個檔案，請選擇其他檔案後再試一次。',
    writeFailed: '無法儲存變更，你的編輯內容仍保留在畫面中。',
    linkFailed: '無法使用瀏覽器開啟這個連結。',
    themeLight: '使用淺色主題',
    themeDark: '使用深色主題',
  },
};

export function resolveLocale(language: string): AppLocale {
  const normalized = language.toLowerCase();
  if (normalized === 'zh-tw' || normalized.startsWith('zh-hant')) {
    return 'zh-TW';
  }
  return 'en';
}

export function createTranslator(locale: AppLocale) {
  return <Key extends keyof Translations>(key: Key): Translations[Key] => (
    translations[locale][key]
  );
}
