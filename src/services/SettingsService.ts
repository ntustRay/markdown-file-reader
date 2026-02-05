export interface ReadingSettings {
  fontSize: number;      // 12-24
  lineHeight: number;    // 1.4-2.0
  contentWidth: number;  // 600-1200 (px) or 0 for full width
  showToc: boolean;
}

const STORAGE_KEY = 'quilltide_reading_settings';

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 16,
  lineHeight: 1.6,
  contentWidth: 800,
  showToc: false,
};

export class SettingsService {
  private settings: ReadingSettings;
  private listeners: Array<(settings: ReadingSettings) => void> = [];

  constructor() {
    this.settings = this.loadSettings();
    this.applySettings();
  }

  private loadSettings(): ReadingSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  getSettings(): ReadingSettings {
    return { ...this.settings };
  }

  updateSettings(partial: Partial<ReadingSettings>): void {
    this.settings = { ...this.settings, ...partial };
    this.saveSettings();
    this.applySettings();
    this.notifyListeners();
  }

  resetToDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.applySettings();
    this.notifyListeners();
  }

  // 字級
  setFontSize(size: number): void {
    const clamped = Math.max(12, Math.min(24, size));
    this.updateSettings({ fontSize: clamped });
  }

  increaseFontSize(): void {
    this.setFontSize(this.settings.fontSize + 1);
  }

  decreaseFontSize(): void {
    this.setFontSize(this.settings.fontSize - 1);
  }

  // 行高
  setLineHeight(height: number): void {
    const clamped = Math.max(1.4, Math.min(2.0, height));
    this.updateSettings({ lineHeight: Math.round(clamped * 10) / 10 });
  }

  // 版心寬度
  setContentWidth(width: number): void {
    const clamped = width === 0 ? 0 : Math.max(600, Math.min(1200, width));
    this.updateSettings({ contentWidth: clamped });
  }

  // TOC 顯示
  toggleToc(): void {
    this.updateSettings({ showToc: !this.settings.showToc });
  }

  setShowToc(show: boolean): void {
    this.updateSettings({ showToc: show });
  }

  // 套用設定到 CSS
  private applySettings(): void {
    const root = document.documentElement;

    root.style.setProperty('--reading-font-size', `${this.settings.fontSize}px`);
    root.style.setProperty('--reading-line-height', `${this.settings.lineHeight}`);
    root.style.setProperty(
      '--reading-content-width',
      this.settings.contentWidth === 0 ? '100%' : `${this.settings.contentWidth}px`
    );

    // Update markdown-body styles
    const markdownBody = document.querySelector('.markdown-body') as HTMLElement;
    if (markdownBody) {
      markdownBody.style.fontSize = `${this.settings.fontSize}px`;
      markdownBody.style.lineHeight = `${this.settings.lineHeight}`;
      markdownBody.style.maxWidth = this.settings.contentWidth === 0
        ? '100%'
        : `${this.settings.contentWidth}px`;
    }
  }

  // 監聽設定變更
  onChange(callback: (settings: ReadingSettings) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.settings));
  }

  // 取得設定預設值
  static getDefaults(): ReadingSettings {
    return { ...DEFAULT_SETTINGS };
  }

  // 取得設定範圍
  static getRanges(): Record<string, { min: number; max: number; step: number }> {
    return {
      fontSize: { min: 12, max: 24, step: 1 },
      lineHeight: { min: 1.4, max: 2.0, step: 0.1 },
      contentWidth: { min: 600, max: 1200, step: 50 },
    };
  }
}
