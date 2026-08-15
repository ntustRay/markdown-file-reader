export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function readSavedTheme(): Theme | null {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null;
  } catch {
    return null;
  }
}

export class ThemeService {
  private currentTheme: Theme;
  private hasManualPreference: boolean;
  private readonly listeners: Array<(theme: Theme) => void> = [];

  constructor() {
    const savedTheme = readSavedTheme();
    this.hasManualPreference = savedTheme !== null;
    this.currentTheme = savedTheme ?? this.getSystemTheme();
    this.applyTheme(this.currentTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (this.hasManualPreference) {
        return;
      }
      this.currentTheme = event.matches ? 'dark' : 'light';
      this.applyTheme(this.currentTheme);
      this.notifyListeners();
    });
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.hasManualPreference = true;
    this.applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The active theme still works when storage is unavailable.
    }
    this.notifyListeners();
  }

  toggleTheme(): Theme {
    const nextTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
    return nextTheme;
  }

  onThemeChange(callback: (theme: Theme) => void): void {
    this.listeners.push(callback);
  }

  private getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentTheme);
    }
  }
}
