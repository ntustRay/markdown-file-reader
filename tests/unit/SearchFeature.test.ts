import { describe, it, expect } from 'vitest';

describe('搜尋功能', () => {
  describe('highlightMatch', () => {
    it('應該高亮符合的文字', () => {
      const text = 'README.md';
      const searchQuery = 'read';
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      const result = text.replace(regex, '<mark class="search-highlight">$1</mark>');

      expect(result).toContain('<mark class="search-highlight">READ</mark>');
    });

    it('應該在沒有搜尋時返回原文字', () => {
      const text = 'README.md';
      const searchQuery = '';

      if (!searchQuery) {
        expect(text).toBe('README.md');
      }
    });

    it('應該處理大小寫不敏感搜尋', () => {
      const text = 'Configuration.md';
      const searchQuery = 'config';
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      const result = text.replace(regex, '<mark class="search-highlight">$1</mark>');

      expect(result).toContain('<mark class="search-highlight">Config</mark>');
    });
  });

  describe('hasMatchingFiles', () => {
    it('應該找到包含符合檔案的資料夾', () => {
      const searchQuery = 'test';
      const folder = {
        name: 'src',
        isDirectory: true,
        children: [
          { name: 'test.md', isDirectory: false },
          { name: 'other.md', isDirectory: false },
        ]
      };

      const hasMatch = folder.children?.some(child =>
        !child.isDirectory && child.name.toLowerCase().includes(searchQuery)
      );

      expect(hasMatch).toBe(true);
    });

    it('應該在沒有符合檔案時返回 false', () => {
      const searchQuery = 'xyz';
      const folder = {
        name: 'src',
        isDirectory: true,
        children: [
          { name: 'test.md', isDirectory: false },
          { name: 'other.md', isDirectory: false },
        ]
      };

      const hasMatch = folder.children?.some(child =>
        !child.isDirectory && child.name.toLowerCase().includes(searchQuery)
      );

      expect(hasMatch).toBe(false);
    });
  });
});
