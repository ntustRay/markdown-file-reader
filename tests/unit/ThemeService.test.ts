import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeService } from '../../src/services/ThemeService';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } satisfies MediaQueryList));
  });

  it('follows the system theme until the user chooses one', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const service = new ThemeService();

    expect(service.getCurrentTheme()).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('restores and persists a manual theme choice', () => {
    localStorage.setItem('theme', 'dark');
    const service = new ThemeService();

    expect(service.getCurrentTheme()).toBe('dark');
    expect(service.toggleTheme()).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('reacts to system changes before a manual choice', () => {
    let systemListener: ((event: MediaQueryListEvent) => void) | null = null;
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn((_type, listener) => {
        if (typeof listener === 'function') {
          systemListener = listener;
        }
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    const service = new ThemeService();

    systemListener?.(new MediaQueryListEvent('change', { matches: true }));

    expect(service.getCurrentTheme()).toBe('dark');
  });
});
