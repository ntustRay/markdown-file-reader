import { FileService, FileTreeNode } from './services/FileService';
import { ThemeService } from './services/ThemeService';
import { MarkdownService } from './services/MarkdownService';

export class App {
  private fileService: FileService;
  private themeService: ThemeService;
  private markdownService: MarkdownService;

  private contentDiv: HTMLDivElement;
  private fileNameSpan: HTMLSpanElement;
  private openFileBtn: HTMLButtonElement;
  private openFolderBtn: HTMLButtonElement;
  private saveFileBtn: HTMLButtonElement;
  private themeToggleBtn: HTMLButtonElement;
  private editModeToggleBtn: HTMLButtonElement;
  private editorPane: HTMLDivElement;
  private previewPane: HTMLDivElement;
  private editorTextarea: HTMLTextAreaElement;
  private editorGutter: HTMLDivElement;
  private fileListNav: HTMLElement;
  private searchInput: HTMLInputElement;

  private isEditMode: boolean = false;
  private currentContent: string = '';
  private hasUnsavedChanges: boolean = false;
  private searchQuery: string = '';

  constructor() {
    // Initialize services
    this.fileService = new FileService();
    this.themeService = new ThemeService();
    this.markdownService = new MarkdownService();

    // Get DOM elements
    this.contentDiv = document.getElementById('content') as HTMLDivElement;
    this.fileNameSpan = document.getElementById('file-name') as HTMLSpanElement;
    this.openFileBtn = document.getElementById('open-file') as HTMLButtonElement;
    this.openFolderBtn = document.getElementById('open-folder') as HTMLButtonElement;
    this.saveFileBtn = document.getElementById('save-file') as HTMLButtonElement;
    this.themeToggleBtn = document.getElementById('theme-toggle') as HTMLButtonElement;
    this.editModeToggleBtn = document.getElementById('edit-mode-toggle') as HTMLButtonElement;
    this.editorPane = document.getElementById('editor-pane') as HTMLDivElement;
    this.previewPane = document.getElementById('preview-pane') as HTMLDivElement;
    this.editorTextarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    this.editorGutter = document.getElementById('editor-gutter') as HTMLDivElement;
    this.fileListNav = document.getElementById('file-list') as HTMLElement;
    this.searchInput = document.getElementById('search-input') as HTMLInputElement;

    this.setupEventListeners();
    this.showWelcomeMessage();
    this.updateThemeIcon();
  }

  private setupEventListeners(): void {
    // File open button
    this.openFileBtn.addEventListener('click', () => this.handleOpenFile());

    // Folder open button
    this.openFolderBtn.addEventListener('click', () => this.handleOpenFolder());

    // Save file button
    this.saveFileBtn.addEventListener('click', () => this.handleSaveFile());

    // Theme toggle button
    this.themeToggleBtn.addEventListener('click', () => this.handleThemeToggle());

    // Edit mode toggle button
    this.editModeToggleBtn.addEventListener('click', () => this.handleEditModeToggle());

    // Listen for file changes
    this.fileService.onFileOpen((file) => this.handleFileOpened(file));

    // Listen for folder changes
    this.fileService.onFolderOpen((files, folder) => this.handleFolderOpened(files, folder));

    // Listen for theme changes
    this.themeService.onThemeChange(() => this.updateThemeIcon());

    // Editor textarea changes
    this.editorTextarea.addEventListener('input', () => this.handleEditorInput());
    this.editorTextarea.addEventListener('scroll', () => this.syncGutterScroll());

    // Search input
    this.searchInput.addEventListener('input', () => this.handleSearchInput());
  }

  private async handleOpenFile(): Promise<void> {
    try {
      await this.fileService.openFile();
      // File opened event will be handled by the listener
    } catch (error) {
      console.error('Error opening file:', error);
      this.showError(`開啟檔案時發生錯誤: ${error}`);
    }
  }

  private async handleOpenFolder(): Promise<void> {
    try {
      await this.fileService.openFolder();
      // Folder opened event will be handled by the listener
    } catch (error) {
      console.error('Error opening folder:', error);
      this.showError(`開啟資料夾時發生錯誤: ${error}`);
    }
  }

  private async handleSaveFile(): Promise<void> {
    try {
      await this.fileService.saveFile(this.currentContent);
      this.hasUnsavedChanges = false;
      this.updateSaveButtonState();

      // Show success message briefly
      const originalText = this.saveFileBtn.querySelector('span:not(.material-symbols-outlined)')?.textContent;
      const textSpan = this.saveFileBtn.querySelector('span:not(.material-symbols-outlined)');
      if (textSpan) {
        textSpan.textContent = '已儲存';
        setTimeout(() => {
          textSpan.textContent = originalText || '儲存';
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      this.showError(`儲存檔案時發生錯誤: ${error}`);
    }
  }

  private async handleFileOpened(file: { path: string; content: string; name: string }): Promise<void> {
    try {
      this.currentContent = file.content;
      this.hasUnsavedChanges = false;

      // Update file name display
      this.fileNameSpan.textContent = file.name;

      // Render markdown
      await this.renderMarkdown(file.content);

      // Update editor if in edit mode
      if (this.isEditMode) {
        this.editorTextarea.value = file.content;
        this.updateLineNumbers();
      }

      this.updateSaveButtonState();
    } catch (error) {
      console.error('Error rendering markdown:', error);
      this.showError(`渲染 Markdown 時發生錯誤: ${error}`);
    }
  }

  private handleFolderOpened(tree: FileTreeNode[], folder: string): void {
    // Update file tree in sidebar
    this.updateFileTree(tree);

    // Update breadcrumb
    const folderName = folder.split(/[\\/]/).pop() || 'Folder';
    const breadcrumbItem = document.querySelector('.breadcrumb-item');
    if (breadcrumbItem) {
      breadcrumbItem.textContent = folderName;
    }
  }

  private async renderMarkdown(content: string): Promise<void> {
    const html = await this.markdownService.render(content);
    this.contentDiv.innerHTML = html;
  }

  private handleThemeToggle(): void {
    this.themeService.toggleTheme();
  }

  private updateThemeIcon(): void {
    const themeIcon = this.themeToggleBtn.querySelector('.theme-icon');
    if (themeIcon) {
      const currentTheme = this.themeService.getCurrentTheme();
      themeIcon.textContent = currentTheme === 'dark' ? 'dark_mode' : 'light_mode';
    }
  }

  private handleEditModeToggle(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      // Switch to edit mode - show split view
      this.editorPane.style.display = 'flex';
      this.previewPane.style.flex = '1';
      this.editorPane.style.flex = '1';

      // Update editor content
      this.editorTextarea.value = this.currentContent;
      this.updateLineNumbers();

      // Update button text
      const btnText = this.editModeToggleBtn.querySelector('span:not(.material-symbols-outlined)');
      if (btnText) btnText.textContent = '預覽';
      const btnIcon = this.editModeToggleBtn.querySelector('.material-symbols-outlined');
      if (btnIcon) btnIcon.textContent = 'visibility';

      // Show save button
      this.saveFileBtn.style.display = 'flex';
    } else {
      // Switch to preview mode - hide editor
      this.editorPane.style.display = 'none';
      this.previewPane.style.flex = '1';

      // Update button text
      const btnText = this.editModeToggleBtn.querySelector('span:not(.material-symbols-outlined)');
      if (btnText) btnText.textContent = '編輯';
      const btnIcon = this.editModeToggleBtn.querySelector('.material-symbols-outlined');
      if (btnIcon) btnIcon.textContent = 'edit';

      // Hide save button
      this.saveFileBtn.style.display = 'none';
    }

    this.updateSaveButtonState();
  }

  private async handleEditorInput(): Promise<void> {
    this.currentContent = this.editorTextarea.value;
    this.hasUnsavedChanges = true;
    await this.renderMarkdown(this.currentContent);
    this.updateLineNumbers();
    this.updateSaveButtonState();
  }

  private updateSaveButtonState(): void {
    if (this.isEditMode && this.hasUnsavedChanges) {
      this.saveFileBtn.disabled = false;
      this.saveFileBtn.style.opacity = '1';
    } else {
      this.saveFileBtn.disabled = !this.isEditMode;
      this.saveFileBtn.style.opacity = this.isEditMode ? '0.5' : '1';
    }
  }

  private handleSearchInput(): void {
    this.searchQuery = this.searchInput.value.toLowerCase().trim();

    // Re-render the file tree with search filter
    const tree = this.fileService.getFileTree();
    this.updateFileTree(tree);
  }

  private updateFileTree(tree: FileTreeNode[]): void {
    // Clear existing file list (keep the header)
    const header = this.fileListNav.querySelector('.file-section-header');
    this.fileListNav.innerHTML = '';
    if (header) {
      this.fileListNav.appendChild(header);
    }

    // Render tree
    this.renderTreeNodes(tree, this.fileListNav);
  }

  private renderTreeNodes(nodes: FileTreeNode[], container: HTMLElement): void {
    nodes.forEach((node) => {
      if (node.isDirectory) {
        // Check if folder has matching children
        const hasMatchingChildren = this.searchQuery
          ? this.hasMatchingFiles(node)
          : true;

        if (!hasMatchingChildren) return; // Skip folder if no matches

        // Render folder
        const folderItem = document.createElement('div');
        folderItem.className = 'file-item folder-item';
        folderItem.style.paddingLeft = `${(node.level || 0) * 16 + 12}px`;

        // Auto-expand if searching and has matches
        const isExpanded = this.searchQuery
          ? (node.isExpanded || hasMatchingChildren)
          : (node.isExpanded || false);

        folderItem.innerHTML = `
          <span class="material-symbols-outlined folder-icon">${isExpanded ? 'expand_more' : 'chevron_right'}</span>
          <span class="material-symbols-outlined">${isExpanded ? 'folder_open' : 'folder'}</span>
          <span>${this.highlightMatch(node.name)}</span>
        `;

        folderItem.addEventListener('click', (e) => {
          e.stopPropagation();
          node.isExpanded = !node.isExpanded;
          this.updateFileTree(this.fileService.getFileTree());
        });

        container.appendChild(folderItem);

        // Render children if expanded
        if (isExpanded && node.children && node.children.length > 0) {
          this.renderTreeNodes(node.children, container);
        }
      } else {
        // Filter files by search query
        if (this.searchQuery && !node.name.toLowerCase().includes(this.searchQuery)) {
          return; // Skip non-matching files
        }

        // Render file
        const fileItem = document.createElement('div');
        const isActive = this.fileService.getCurrentFile()?.path === node.path;
        fileItem.className = `file-item ${isActive ? 'active' : ''}`;
        fileItem.style.paddingLeft = `${(node.level || 0) * 16 + 12}px`;

        fileItem.innerHTML = `
          <span class="material-symbols-outlined file-icon">article</span>
          <span>${this.highlightMatch(node.name)}</span>
        `;

        fileItem.addEventListener('click', async () => {
          // Remove active class from all items
          container.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
          });

          // Add active class to clicked item
          fileItem.classList.add('active');

          // Open file
          try {
            await this.fileService.openFileByPath(node.path);
          } catch (error) {
            console.error('Error opening file:', error);
            this.showError(`開啟檔案時發生錯誤: ${error}`);
          }
        });

        container.appendChild(fileItem);
      }
    });
  }

  private hasMatchingFiles(node: FileTreeNode): boolean {
    if (!node.children) return false;

    for (const child of node.children) {
      if (child.isDirectory) {
        if (this.hasMatchingFiles(child)) return true;
      } else {
        if (child.name.toLowerCase().includes(this.searchQuery)) {
          return true;
        }
      }
    }

    return false;
  }

  private highlightMatch(text: string): string {
    if (!this.searchQuery) return text;

    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  private updateLineNumbers(): void {
    const lines = this.editorTextarea.value.split('\n');
    const lineNumbers = lines.map((_, i) => i + 1).join('\n');
    this.editorGutter.textContent = lineNumbers;
  }

  private syncGutterScroll(): void {
    this.editorGutter.scrollTop = this.editorTextarea.scrollTop;
  }

  private showWelcomeMessage(): void {
    this.contentDiv.innerHTML = `
      <div style="text-align: center; padding: 80px 20px; color: var(--text-muted);">
        <span class="material-symbols-outlined" style="font-size: 64px; color: var(--primary); opacity: 0.5;">description</span>
        <h2 style="margin-top: 24px; font-size: 24px; color: var(--text-main);">歡迎使用 MarkView</h2>
        <p style="margin-top: 12px; font-size: 16px;">點擊左下方的「開啟檔案」按鈕開始閱讀 Markdown 文件</p>
      </div>
    `;
  }

  private showError(message: string): void {
    this.contentDiv.innerHTML = `<p style="color: #ef4444; padding: 20px;">${message}</p>`;
  }
}
