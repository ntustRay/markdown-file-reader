import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FileService } from '../../src/services/FileService';
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile, readDir } from '@tauri-apps/plugin-fs';

vi.mock('@tauri-apps/plugin-dialog');
vi.mock('@tauri-apps/plugin-fs');

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(() => {
    vi.clearAllMocks();
    fileService = new FileService();
  });

  describe('openFile', () => {
    it('應該成功開啟並讀取檔案', async () => {
      const mockPath = 'C:\\test\\file.md';
      const mockContent = '# Test Content';

      vi.mocked(open).mockResolvedValue(mockPath);
      vi.mocked(readTextFile).mockResolvedValue(mockContent);

      const result = await fileService.openFile();

      expect(open).toHaveBeenCalledWith({
        multiple: false,
        filters: [{
          name: 'Markdown',
          extensions: ['md', 'markdown', 'txt']
        }]
      });

      expect(result).toEqual({
        path: 'C:/test/file.md', // Normalized to forward slashes
        content: mockContent,
        name: 'file.md'
      });
    });

    it('應該在使用者取消時返回 null', async () => {
      vi.mocked(open).mockResolvedValue(null);

      const result = await fileService.openFile();

      expect(result).toBeNull();
    });

    it('應該處理檔案讀取錯誤', async () => {
      const mockPath = 'C:\\test\\file.md';
      vi.mocked(open).mockResolvedValue(mockPath);
      vi.mocked(readTextFile).mockRejectedValue(new Error('Read error'));

      await expect(fileService.openFile()).rejects.toThrow('Read error');
    });
  });

  describe('getCurrentFile', () => {
    it('應該在沒有開啟檔案時返回 null', () => {
      expect(fileService.getCurrentFile()).toBeNull();
    });

    it('應該返回當前開啟的檔案', async () => {
      const mockPath = 'C:\\test\\file.md';
      const mockContent = '# Test';

      vi.mocked(open).mockResolvedValue(mockPath);
      vi.mocked(readTextFile).mockResolvedValue(mockContent);

      await fileService.openFile();

      const currentFile = fileService.getCurrentFile();
      expect(currentFile).toEqual({
        path: 'C:/test/file.md', // Normalized to forward slashes
        content: mockContent,
        name: 'file.md'
      });
    });
  });

  describe('getFileName', () => {
    it('應該從完整路徑提取檔案名稱 (Windows)', () => {
      const path = 'C:\\Users\\Test\\Documents\\file.md';
      const name = fileService['getFileName'](path);
      expect(name).toBe('file.md');
    });

    it('應該從完整路徑提取檔案名稱 (Unix)', () => {
      const path = '/home/user/documents/file.md';
      const name = fileService['getFileName'](path);
      expect(name).toBe('file.md');
    });

    it('應該處理沒有路徑的檔案名稱', () => {
      const path = 'file.md';
      const name = fileService['getFileName'](path);
      expect(name).toBe('file.md');
    });
  });

  describe('事件監聽', () => {
    it('應該在檔案開啟時觸發回調', async () => {
      const callback = vi.fn();
      fileService.onFileOpen(callback);

      const mockPath = 'C:\\test\\file.md';
      const mockContent = '# Test';

      vi.mocked(open).mockResolvedValue(mockPath);
      vi.mocked(readTextFile).mockResolvedValue(mockContent);

      await fileService.openFile();

      expect(callback).toHaveBeenCalledWith({
        path: 'C:/test/file.md', // Normalized to forward slashes
        content: mockContent,
        name: 'file.md'
      });
    });
  });

  describe('openFolder', () => {
    it('應該成功開啟資料夾並建立檔案樹', async () => {
      const mockFolderPath = 'C:\\test\\folder';
      const mockEntries = [
        { name: 'subfolder', isDirectory: true },
        { name: 'file1.md', isDirectory: false },
        { name: 'file2.markdown', isDirectory: false },
        { name: 'image.png', isDirectory: false },
      ];
      const mockSubEntries = [
        { name: 'file3.txt', isDirectory: false },
      ];

      vi.mocked(open).mockResolvedValue(mockFolderPath);
      // Mock for buildFileTree (2 calls) and collectMarkdownFiles (2 calls)
      vi.mocked(readDir)
        .mockResolvedValueOnce(mockEntries as any)  // First buildFileTree
        .mockResolvedValueOnce(mockSubEntries as any)  // buildFileTree subfolder
        .mockResolvedValueOnce(mockEntries as any)  // First collectMarkdownFiles
        .mockResolvedValueOnce(mockSubEntries as any); // collectMarkdownFiles subfolder
      vi.mocked(readTextFile).mockResolvedValue('# Content');

      const result = await fileService.openFolder();

      expect(result).toHaveLength(3); // file1.md, file2.markdown, file3.txt
      const tree = fileService.getFileTree();
      expect(tree.length).toBeGreaterThan(0);
    });

    it('應該在使用者取消時返回 null', async () => {
      vi.mocked(open).mockResolvedValue(null);

      const result = await fileService.openFolder();

      expect(result).toBeNull();
    });

    it('應該遞迴讀取子資料夾中的檔案', async () => {
      const mockFolderPath = 'C:\\test\\folder';
      const mockEntries = [
        { name: 'subfolder', isDirectory: true },
      ];
      const mockSubEntries = [
        { name: 'nested.md', isDirectory: false },
      ];

      vi.mocked(open).mockResolvedValue(mockFolderPath);
      // Mock for buildFileTree and collectMarkdownFiles
      vi.mocked(readDir)
        .mockResolvedValueOnce(mockEntries as any)  // buildFileTree root
        .mockResolvedValueOnce(mockSubEntries as any)  // buildFileTree subfolder
        .mockResolvedValueOnce(mockEntries as any)  // collectMarkdownFiles root
        .mockResolvedValueOnce(mockSubEntries as any); // collectMarkdownFiles subfolder
      vi.mocked(readTextFile).mockResolvedValue('# Nested Content');

      await fileService.openFolder();

      const files = fileService.getFolderFiles();
      expect(files).toHaveLength(1);
      expect(files[0].name).toBe('nested.md');
    });
  });

  describe('saveFile', () => {
    it('應該儲存檔案內容', async () => {
      const mockPath = 'C:\\test\\file.md';
      const mockContent = '# Test';
      const newContent = '# Updated';

      vi.mocked(open).mockResolvedValue(mockPath);
      vi.mocked(readTextFile).mockResolvedValue(mockContent);

      await fileService.openFile();
      await fileService.saveFile(newContent);

      expect(writeTextFile).toHaveBeenCalledWith('C:/test/file.md', newContent); // Normalized to forward slashes
    });

    it('應該在沒有開啟檔案時拋出錯誤', async () => {
      await expect(fileService.saveFile('content')).rejects.toThrow('No file is currently open');
    });
  });
});
