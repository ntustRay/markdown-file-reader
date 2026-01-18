import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeService, Theme } from '../../src/services/ThemeService';

describe('ThemeService', () => {
  let themeService: ThemeService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();

    // Clear body classes
    document.body.className = '';

    themeService = new ThemeService();
  });

  describe('初始化', () => {
    it('應該預設為 light 主題', () => {
      expect(themeService.getCurrentTheme()).toBe('light');
    });

    it('應該從 localStorage 載入儲存的主題', () => {
      localStorage.setItem('theme', 'dark');
      const service = new ThemeService();
      expect(service.getCurrentTheme()).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('應該設定 light 主題', () => {
      themeService.setTheme('light');
      expect(themeService.getCurrentTheme()).toBe('light');
      expect(document.body.classList.contains('dark')).toBe(false);
    });

    it('應該設定 dark 主題', () => {
      themeService.setTheme('dark');
      expect(themeService.getCurrentTheme()).toBe('dark');
      expect(document.body.classList.contains('dark')).toBe(true);
    });

    it('應該將主題儲存到 localStorage', () => {
      themeService.setTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('toggleTheme', () => {
    it('應該從 light 切換到 dark', () => {
      themeService.setTheme('light');
      const newTheme = themeService.toggleTheme();
      expect(newTheme).toBe('dark');
      expect(themeService.getCurrentTheme()).toBe('dark');
    });

    it('應該從 dark 切換到 light', () => {
      themeService.setTheme('dark');
      const newTheme = themeService.toggleTheme();
      expect(newTheme).toBe('light');
      expect(themeService.getCurrentTheme()).toBe('light');
    });
  });

  describe('事件監聽', () => {
    it('應該在主題改變時觸發回調', () => {
      const callback = vi.fn();
      themeService.onThemeChange(callback);

      themeService.setTheme('dark');

      expect(callback).toHaveBeenCalledWith('dark');
    });

    it('應該支援多個回調', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      themeService.onThemeChange(callback1);
      themeService.onThemeChange(callback2);

      themeService.setTheme('dark');

      expect(callback1).toHaveBeenCalledWith('dark');
      expect(callback2).toHaveBeenCalledWith('dark');
    });
  });
});
