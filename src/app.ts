import { getCurrentWindow } from '@tauri-apps/api/window';
import { DocumentError, hasUnsavedChanges, type DocumentFile } from './domain/Document';
import { createTranslator, resolveLocale, type Translations } from './localization';
import { openExternalUrl } from './services/ExternalLinkService';
import { FileService } from './services/FileService';
import { MarkdownService } from './services/MarkdownService';
import { ThemeService, type Theme } from './services/ThemeService';

type ViewMode = 'preview' | 'edit';
type UnsavedDecision = 'save' | 'discard' | 'cancel';

interface ElementConstructor<ElementType extends HTMLElement> {
  new(): ElementType;
}

function requiredElement<ElementType extends HTMLElement>(
  id: string,
  constructor: ElementConstructor<ElementType>,
): ElementType {
  const element = document.getElementById(id);
  if (!(element instanceof constructor)) {
    throw new Error(`Missing required element: ${id}`);
  }
  return element;
}

export class App {
  private readonly fileService = new FileService();
  private readonly markdownService = new MarkdownService();
  private readonly themeService = new ThemeService();
  private readonly t = createTranslator(resolveLocale(navigator.language));
  private mode: ViewMode = 'preview';
  private isClosing = false;

  private readonly appName = requiredElement('app-name', HTMLSpanElement);
  private readonly fileName = requiredElement('file-name', HTMLSpanElement);
  private readonly openFileButton = requiredElement('open-file', HTMLButtonElement);
  private readonly emptyOpenFileButton = requiredElement('empty-open-file', HTMLButtonElement);
  private readonly saveButton = requiredElement('save-file', HTMLButtonElement);
  private readonly themeButton = requiredElement('theme-toggle', HTMLButtonElement);
  private readonly emptyState = requiredElement('empty-state', HTMLElement);
  private readonly emptyTitle = requiredElement('empty-title', HTMLHeadingElement);
  private readonly emptyHint = requiredElement('empty-hint', HTMLParagraphElement);
  private readonly previewPane = requiredElement('preview-pane', HTMLElement);
  private readonly editor = requiredElement('editor-textarea', HTMLTextAreaElement);
  private readonly modeButton = requiredElement('mode-toggle', HTMLButtonElement);
  private readonly modeLabel = requiredElement('mode-label', HTMLSpanElement);
  private readonly notice = requiredElement('notice', HTMLDivElement);
  private readonly unsavedDialog = requiredElement('unsaved-dialog', HTMLDialogElement);
  private readonly unsavedTitle = requiredElement('unsaved-title', HTMLHeadingElement);
  private readonly unsavedMessage = requiredElement('unsaved-message', HTMLParagraphElement);
  private readonly cancelDiscard = requiredElement('cancel-discard', HTMLButtonElement);
  private readonly confirmDiscard = requiredElement('confirm-discard', HTMLButtonElement);
  private readonly confirmSave = requiredElement('confirm-save', HTMLButtonElement);

  constructor() {
    this.applyTranslations();
    this.updateThemeControl(this.themeService.getCurrentTheme());
    this.bindEvents();
    this.updateView();
    void this.bindWindowClose();
  }

  private bindEvents(): void {
    this.openFileButton.addEventListener('click', () => void this.openFile());
    this.emptyOpenFileButton.addEventListener('click', () => void this.openFile());
    this.saveButton.addEventListener('click', () => void this.saveFile());
    this.themeButton.addEventListener('click', () => {
      this.updateThemeControl(this.themeService.toggleTheme());
    });
    this.modeButton.addEventListener('click', () => void this.toggleMode());
    this.editor.addEventListener('input', () => {
      this.fileService.updateDraft(this.editor.value);
      this.updateDocumentControls();
    });
    this.previewPane.addEventListener('click', (event) => void this.openPreviewLink(event));
  }

  private async bindWindowClose(): Promise<void> {
    await getCurrentWindow().onCloseRequested((event) => {
      if (this.isClosing) {
        return;
      }
      const current = this.fileService.getCurrentDocument();
      if (current === null || !hasUnsavedChanges(current)) {
        return;
      }
      event.preventDefault();
      void this.resolveCloseRequest();
    });
  }

  private async openFile(): Promise<void> {
    const current = this.fileService.getCurrentDocument();
    if (current !== null && hasUnsavedChanges(current)) {
      const decision = await this.confirmUnsavedChanges();
      if (decision === 'cancel') {
        return;
      }
      if (decision === 'save' && !(await this.saveFile())) {
        return;
      }
    }

    try {
      const document = await this.fileService.openDocument();
      if (document === null) {
        return;
      }
      this.mode = 'preview';
      this.editor.value = document.draftContent;
      await this.renderPreview(document);
      this.updateView();
    } catch (error: unknown) {
      this.showNotice(this.messageForOpenError(error));
    }
  }

  private async saveFile(): Promise<boolean> {
    if (this.fileService.getCurrentDocument() === null) {
      return false;
    }
    this.saveButton.disabled = true;
    this.saveButton.textContent = this.t('saving');
    try {
      await this.fileService.saveDocument();
      this.updateDocumentControls();
      return true;
    } catch {
      this.showNotice(this.t('writeFailed'));
      this.updateDocumentControls();
      return false;
    }
  }

  private async toggleMode(): Promise<void> {
    const current = this.fileService.getCurrentDocument();
    if (current === null) {
      return;
    }
    this.mode = this.mode === 'preview' ? 'edit' : 'preview';
    if (this.mode === 'preview') {
      await this.renderPreview(current);
    }
    this.updateView();
    if (this.mode === 'edit') {
      this.editor.focus();
    }
  }

  private async renderPreview(document: DocumentFile): Promise<void> {
    this.previewPane.innerHTML = document.kind === 'text'
      ? this.markdownService.renderPlainText(document.draftContent)
      : await this.markdownService.render(document.draftContent);
    this.previewPane.scrollTop = 0;
  }

  private async openPreviewLink(event: MouseEvent): Promise<void> {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const anchor = target.closest('a[data-external-link]');
    if (!(anchor instanceof HTMLAnchorElement)) {
      return;
    }
    event.preventDefault();
    try {
      await openExternalUrl(anchor.href);
    } catch {
      this.showNotice(this.t('linkFailed'));
    }
  }

  private async resolveCloseRequest(): Promise<void> {
    const decision = await this.confirmUnsavedChanges();
    if (decision === 'cancel') {
      return;
    }
    if (decision === 'save' && !(await this.saveFile())) {
      return;
    }
    this.isClosing = true;
    await getCurrentWindow().destroy();
  }

  private confirmUnsavedChanges(): Promise<UnsavedDecision> {
    return new Promise((resolve) => {
      const handleClose = (): void => {
        this.unsavedDialog.removeEventListener('close', handleClose);
        const value = this.unsavedDialog.returnValue;
        resolve(value === 'save' || value === 'discard' ? value : 'cancel');
      };
      this.unsavedDialog.addEventListener('close', handleClose);
      this.unsavedDialog.showModal();
    });
  }

  private updateView(): void {
    const hasDocument = this.fileService.getCurrentDocument() !== null;
    this.emptyState.hidden = hasDocument;
    this.previewPane.hidden = !hasDocument || this.mode !== 'preview';
    this.editor.hidden = !hasDocument || this.mode !== 'edit';
    this.modeButton.hidden = !hasDocument;
    this.saveButton.hidden = !hasDocument || this.mode !== 'edit';
    this.modeButton.classList.toggle('is-preview-mode', this.mode === 'preview');
    this.modeLabel.textContent = this.mode === 'preview' ? this.t('edit') : this.t('preview');
    this.modeButton.setAttribute('aria-label', this.modeLabel.textContent);
    this.updateDocumentControls();
  }

  private updateDocumentControls(): void {
    const current = this.fileService.getCurrentDocument();
    if (current === null) {
      this.fileName.textContent = this.t('noFile');
      this.saveButton.hidden = true;
      return;
    }
    const isDirty = hasUnsavedChanges(current);
    this.fileName.textContent = isDirty ? `${current.name} •` : current.name;
    this.saveButton.textContent = this.t('save');
    this.saveButton.disabled = !isDirty;
  }

  private updateThemeControl(theme: Theme): void {
    const label = theme === 'light' ? this.t('themeDark') : this.t('themeLight');
    this.themeButton.setAttribute('aria-label', label);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'light' ? '#f7f9fc' : '#0e1420',
    );
  }

  private applyTranslations(): void {
    const locale = resolveLocale(navigator.language);
    document.documentElement.lang = locale;
    document.title = this.t('appName');
    this.appName.textContent = this.t('appName');
    this.openFileButton.setAttribute('aria-label', this.t('openFile'));
    this.emptyOpenFileButton.textContent = this.t('openFile');
    this.emptyTitle.textContent = this.t('emptyTitle');
    this.emptyHint.textContent = this.t('emptyHint');
    this.editor.setAttribute('aria-label', this.t('editorLabel'));
    this.unsavedTitle.textContent = this.t('unsavedTitle');
    this.unsavedMessage.textContent = this.t('unsavedMessage');
    this.cancelDiscard.textContent = this.t('cancel');
    this.confirmDiscard.textContent = this.t('discard');
    this.confirmSave.textContent = this.t('save');
  }

  private messageForOpenError(error: unknown): Translations[keyof Translations] {
    if (error instanceof DocumentError) {
      if (error.code === 'file-too-large') {
        return this.t('fileTooLarge');
      }
      if (error.code === 'invalid-utf8') {
        return this.t('invalidUtf8');
      }
      if (error.code === 'unsupported-extension') {
        return this.t('unsupportedExtension');
      }
    }
    return this.t('readFailed');
  }

  private showNotice(message: string): void {
    this.notice.textContent = message;
    this.notice.hidden = false;
    window.setTimeout(() => {
      this.notice.hidden = true;
    }, 5000);
  }
}
