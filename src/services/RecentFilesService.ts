export interface RecentFileEntry {
  path: string;
  name: string;
  lastOpened: string; // ISO date string
  isPinned: boolean;
}

const STORAGE_KEY = 'quilltide_recent_files';
const MAX_RECENT_FILES = 20;

export class RecentFilesService {
  private recentFiles: RecentFileEntry[] = [];
  private listeners: Array<(files: RecentFileEntry[]) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  // 載入儲存的資料
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.recentFiles = Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error loading recent files:', error);
      this.recentFiles = [];
    }
  }

  // 儲存到 localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recentFiles));
    } catch (error) {
      console.error('Error saving recent files:', error);
    }
  }

  // 新增或更新最近開啟的檔案
  addRecentFile(path: string, name: string): void {
    // 移除已存在的相同路徑
    const existingIndex = this.recentFiles.findIndex(f => f.path === path);
    let isPinned = false;

    if (existingIndex !== -1) {
      isPinned = this.recentFiles[existingIndex].isPinned;
      this.recentFiles.splice(existingIndex, 1);
    }

    // 新增到列表開頭
    this.recentFiles.unshift({
      path,
      name,
      lastOpened: new Date().toISOString(),
      isPinned,
    });

    // 限制數量（保留釘選的檔案）
    this.trimRecentFiles();

    this.saveToStorage();
    this.notifyListeners();
  }

  // 限制最近檔案數量
  private trimRecentFiles(): void {
    const pinned = this.recentFiles.filter(f => f.isPinned);
    const unpinned = this.recentFiles.filter(f => !f.isPinned);

    // 只對未釘選的檔案進行數量限制
    const maxUnpinned = MAX_RECENT_FILES - pinned.length;
    const trimmedUnpinned = unpinned.slice(0, Math.max(0, maxUnpinned));

    this.recentFiles = [...pinned, ...trimmedUnpinned];
  }

  // 切換釘選狀態
  togglePin(path: string): boolean {
    const file = this.recentFiles.find(f => f.path === path);
    if (file) {
      file.isPinned = !file.isPinned;
      this.saveToStorage();
      this.notifyListeners();
      return file.isPinned;
    }
    return false;
  }

  // 設定釘選狀態
  setPin(path: string, pinned: boolean): void {
    const file = this.recentFiles.find(f => f.path === path);
    if (file) {
      file.isPinned = pinned;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // 移除檔案
  removeFile(path: string): void {
    this.recentFiles = this.recentFiles.filter(f => f.path !== path);
    this.saveToStorage();
    this.notifyListeners();
  }

  // 清除所有未釘選的檔案
  clearUnpinned(): void {
    this.recentFiles = this.recentFiles.filter(f => f.isPinned);
    this.saveToStorage();
    this.notifyListeners();
  }

  // 清除所有檔案
  clearAll(): void {
    this.recentFiles = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  // 取得所有最近檔案（釘選的在前）
  getRecentFiles(): RecentFileEntry[] {
    const pinned = this.recentFiles.filter(f => f.isPinned);
    const unpinned = this.recentFiles.filter(f => !f.isPinned);

    // 按最後開啟時間排序
    pinned.sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime());
    unpinned.sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime());

    return [...pinned, ...unpinned];
  }

  // 取得釘選的檔案
  getPinnedFiles(): RecentFileEntry[] {
    return this.recentFiles
      .filter(f => f.isPinned)
      .sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime());
  }

  // 取得未釘選的最近檔案
  getUnpinnedFiles(): RecentFileEntry[] {
    return this.recentFiles
      .filter(f => !f.isPinned)
      .sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime());
  }

  // 檢查檔案是否已釘選
  isPinned(path: string): boolean {
    const file = this.recentFiles.find(f => f.path === path);
    return file?.isPinned ?? false;
  }

  // 監聽變更
  onChange(callback: (files: RecentFileEntry[]) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(): void {
    const files = this.getRecentFiles();
    this.listeners.forEach(listener => listener(files));
  }

  // 取得相對時間顯示
  static getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '剛剛';
    if (diffMins < 60) return `${diffMins} 分鐘前`;
    if (diffHours < 24) return `${diffHours} 小時前`;
    if (diffDays < 7) return `${diffDays} 天前`;

    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
    });
  }
}
