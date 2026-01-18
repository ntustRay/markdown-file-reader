export type Theme = 'light' | 'dark';

export class ThemeService {
  private currentTheme: Theme;
  private listeners: Array<(theme: Theme) => void> = [];

  constructor() {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    this.currentTheme = savedTheme || 'light';
    this.applyTheme(this.currentTheme);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem('theme', theme);
    this.notifyListeners(theme);
  }

  toggleTheme(): Theme {
    const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }

  onThemeChange(callback: (theme: Theme) => void): void {
    this.listeners.push(callback);
  }

  private applyTheme(theme: Theme): void {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  private notifyListeners(theme: Theme): void {
    this.listeners.forEach(listener => listener(theme));
  }
}
