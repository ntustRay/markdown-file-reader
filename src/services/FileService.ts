import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile, readDir } from '@tauri-apps/plugin-fs';

export interface FileInfo {
  path: string;
  content: string;
  name: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileTreeNode[];
  isExpanded?: boolean;
  level?: number;
}

export class FileService {
  private currentFile: FileInfo | null = null;
  private currentFolder: string | null = null;
  private folderFiles: FileInfo[] = [];
  private fileTree: FileTreeNode[] = [];
  private fileOpenListeners: Array<(file: FileInfo) => void> = [];
  private folderOpenListeners: Array<(tree: FileTreeNode[], folder: string) => void> = [];

  async openFile(): Promise<FileInfo | null> {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Markdown',
          extensions: ['md', 'markdown', 'txt']
        }]
      });

      if (!selected) {
        return null;
      }

      // Normalize path to use forward slashes
      const path = (selected as string).replace(/\\/g, '/');
      const content = await readTextFile(path);
      const name = this.getFileName(path);

      const fileInfo: FileInfo = { path, content, name };
      this.currentFile = fileInfo;
      this.notifyFileOpenListeners(fileInfo);

      return fileInfo;
    } catch (error) {
      throw error;
    }
  }

  async openFolder(): Promise<FileInfo[] | null> {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (!selected) {
        return null;
      }

      // Normalize path to use forward slashes
      const folderPath = (selected as string).replace(/\\/g, '/');
      this.currentFolder = folderPath;

      // Build file tree
      this.fileTree = await this.buildFileTree(folderPath, 0);

      // Collect all markdown files
      this.folderFiles = await this.collectMarkdownFiles(folderPath);

      this.notifyFolderOpenListeners(this.fileTree, folderPath);

      // Open the first file if available
      if (this.folderFiles.length > 0) {
        this.currentFile = this.folderFiles[0];
        this.notifyFileOpenListeners(this.folderFiles[0]);
      }

      return this.folderFiles;
    } catch (error) {
      throw error;
    }
  }

  private joinPath(base: string, ...parts: string[]): string {
    // Normalize the base path to use forward slashes
    let normalized = base.replace(/\\/g, '/');

    // Remove trailing slash if present
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }

    // Join all parts with forward slash
    for (const part of parts) {
      if (part) {
        const cleanPart = part.replace(/\\/g, '/');
        normalized += '/' + cleanPart;
      }
    }

    return normalized;
  }

  private async buildFileTree(folderPath: string, level: number): Promise<FileTreeNode[]> {
    const tree: FileTreeNode[] = [];

    try {
      const entries = await readDir(folderPath);

      // Sort: directories first, then files
      const sortedEntries = entries.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      for (const entry of sortedEntries) {
        const fullPath = this.joinPath(folderPath, entry.name);

        if (entry.isDirectory) {
          // Add directory node
          const dirNode: FileTreeNode = {
            name: entry.name,
            path: fullPath,
            isDirectory: true,
            children: [],
            isExpanded: level === 0, // Auto-expand first level
            level,
          };

          // Recursively build children
          dirNode.children = await this.buildFileTree(fullPath, level + 1);

          tree.push(dirNode);
        } else if (this.isMarkdownFile(entry.name)) {
          // Add file node
          tree.push({
            name: entry.name,
            path: fullPath,
            isDirectory: false,
            level,
          });
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${folderPath}:`, error);
    }

    return tree;
  }

  private async collectMarkdownFiles(folderPath: string): Promise<FileInfo[]> {
    const files: FileInfo[] = [];

    try {
      const entries = await readDir(folderPath);

      for (const entry of entries) {
        const fullPath = this.joinPath(folderPath, entry.name);

        if (entry.isDirectory) {
          // Recursively collect from subdirectories
          const subFiles = await this.collectMarkdownFiles(fullPath);
          files.push(...subFiles);
        } else if (this.isMarkdownFile(entry.name)) {
          try {
            const content = await readTextFile(fullPath);
            files.push({
              path: fullPath,
              content,
              name: entry.name,
            });
          } catch (error) {
            console.error(`Error reading file ${entry.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error collecting files from ${folderPath}:`, error);
    }

    return files;
  }

  async saveFile(content: string): Promise<void> {
    if (!this.currentFile) {
      throw new Error('No file is currently open');
    }

    try {
      await writeTextFile(this.currentFile.path, content);
      this.currentFile.content = content;
    } catch (error) {
      throw error;
    }
  }

  getCurrentFile(): FileInfo | null {
    return this.currentFile;
  }

  getFolderFiles(): FileInfo[] {
    return this.folderFiles;
  }

  getFileTree(): FileTreeNode[] {
    return this.fileTree;
  }

  getCurrentFolder(): string | null {
    return this.currentFolder;
  }

  setCurrentFile(file: FileInfo): void {
    this.currentFile = file;
    this.notifyFileOpenListeners(file);
  }

  async openFileByPath(path: string): Promise<void> {
    try {
      // Normalize path to use forward slashes
      const normalizedPath = path.replace(/\\/g, '/');
      const content = await readTextFile(normalizedPath);
      const name = this.getFileName(normalizedPath);
      const fileInfo: FileInfo = { path: normalizedPath, content, name };

      this.currentFile = fileInfo;
      this.notifyFileOpenListeners(fileInfo);
    } catch (error) {
      console.error(`Error opening file at path ${path}:`, error);
      throw error;
    }
  }

  toggleFolderExpansion(node: FileTreeNode): void {
    node.isExpanded = !node.isExpanded;
  }

  onFileOpen(callback: (file: FileInfo) => void): void {
    this.fileOpenListeners.push(callback);
  }

  onFolderOpen(callback: (tree: FileTreeNode[], folder: string) => void): void {
    this.folderOpenListeners.push(callback);
  }

  private isMarkdownFile(filename: string): boolean {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext === 'md' || ext === 'markdown' || ext === 'txt';
  }

  private getFileName(path: string): string {
    return path.split(/[\\/]/).pop() || '';
  }

  private notifyFileOpenListeners(file: FileInfo): void {
    this.fileOpenListeners.forEach(listener => listener(file));
  }

  private notifyFolderOpenListeners(tree: FileTreeNode[], folder: string): void {
    this.folderOpenListeners.forEach(listener => listener(tree, folder));
  }
}
