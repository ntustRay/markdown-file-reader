// 錯誤代碼定義
export enum ErrorCode {
  // 檔案操作錯誤 (1xxx)
  FILE_NOT_FOUND = 'E1001',
  FILE_READ_ERROR = 'E1002',
  FILE_WRITE_ERROR = 'E1003',
  FILE_PERMISSION_DENIED = 'E1004',
  FOLDER_READ_ERROR = 'E1005',
  INVALID_FILE_TYPE = 'E1006',

  // 渲染錯誤 (2xxx)
  MARKDOWN_RENDER_ERROR = 'E2001',
  SANITIZATION_ERROR = 'E2002',

  // 系統錯誤 (3xxx)
  STORAGE_ERROR = 'E3001',
  UNKNOWN_ERROR = 'E3999',
}

// 使用者友善的錯誤訊息對應
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.FILE_NOT_FOUND]: '找不到指定的檔案',
  [ErrorCode.FILE_READ_ERROR]: '讀取檔案時發生錯誤',
  [ErrorCode.FILE_WRITE_ERROR]: '儲存檔案時發生錯誤',
  [ErrorCode.FILE_PERMISSION_DENIED]: '沒有權限存取此檔案',
  [ErrorCode.FOLDER_READ_ERROR]: '讀取資料夾時發生錯誤',
  [ErrorCode.INVALID_FILE_TYPE]: '不支援的檔案格式',
  [ErrorCode.MARKDOWN_RENDER_ERROR]: '渲染 Markdown 時發生錯誤',
  [ErrorCode.SANITIZATION_ERROR]: '處理內容時發生錯誤',
  [ErrorCode.STORAGE_ERROR]: '儲存設定時發生錯誤',
  [ErrorCode.UNKNOWN_ERROR]: '發生未知錯誤',
};

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export interface LogEntry {
  level: 'info' | 'warn' | 'error';
  code?: ErrorCode;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export class ErrorService {
  private static instance: ErrorService;
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private errorListeners: Array<(error: AppError) => void> = [];

  private constructor() {}

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  // 建立應用程式錯誤
  createError(
    code: ErrorCode,
    details?: string,
    context?: Record<string, unknown>
  ): AppError {
    const error: AppError = {
      code,
      message: ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      details,
      timestamp: new Date().toISOString(),
      context: this.sanitizeContext(context),
    };

    this.logError(error);
    this.notifyListeners(error);

    return error;
  }

  // 從原生錯誤建立 AppError
  fromNativeError(
    nativeError: unknown,
    defaultCode: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    context?: Record<string, unknown>
  ): AppError {
    let details: string;
    let code = defaultCode;

    if (nativeError instanceof Error) {
      details = nativeError.message;

      // 嘗試從錯誤訊息推斷錯誤類型
      const detailsLower = details.toLowerCase();
      if (detailsLower.includes('not found') || detailsLower.includes('no such file')) {
        code = ErrorCode.FILE_NOT_FOUND;
      } else if (detailsLower.includes('permission') || detailsLower.includes('access denied')) {
        code = ErrorCode.FILE_PERMISSION_DENIED;
      }
    } else {
      details = String(nativeError);
    }

    return this.createError(code, details, context);
  }

  // 記錄資訊
  logInfo(message: string, context?: Record<string, unknown>): void {
    this.addLog('info', message, undefined, context);
  }

  // 記錄警告
  logWarn(message: string, context?: Record<string, unknown>): void {
    this.addLog('warn', message, undefined, context);
  }

  // 記錄錯誤
  logError(error: AppError): void {
    this.addLog('error', error.message, error.code, {
      details: error.details,
      ...error.context,
    });
  }

  private addLog(
    level: LogEntry['level'],
    message: string,
    code?: ErrorCode,
    context?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      level,
      code,
      message,
      timestamp: new Date().toISOString(),
      context: this.sanitizeContext(context),
    };

    this.logs.push(entry);

    // 限制日誌數量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 輸出到控制台（開發模式）
    if (import.meta.env.DEV) {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]${code ? ` [${code}]` : ''}`;
      if (level === 'error') {
        console.error(prefix, message, context || '');
      } else if (level === 'warn') {
        console.warn(prefix, message, context || '');
      } else {
        console.log(prefix, message, context || '');
      }
    }
  }

  // 清理上下文資料，移除敏感資訊
  private sanitizeContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!context) return undefined;

    const sanitized: Record<string, unknown> = {};
    // 使用更精確的敏感關鍵字匹配
    const sensitivePatterns = [
      /password/i,
      /^token$/i,
      /secret/i,
      /apikey/i,
      /api_key/i,
      /^content$/i,
      /credential/i,
    ];

    for (const [key, value] of Object.entries(context)) {
      if (sensitivePatterns.some(pattern => pattern.test(key))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 200) {
        sanitized[key] = value.substring(0, 200) + '...[truncated]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  // 取得日誌
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // 匯出日誌（不含敏感資料）
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // 清除日誌
  clearLogs(): void {
    this.logs = [];
  }

  // 監聽錯誤事件
  onError(callback: (error: AppError) => void): void {
    this.errorListeners.push(callback);
  }

  private notifyListeners(error: AppError): void {
    this.errorListeners.forEach(listener => listener(error));
  }

  // 取得使用者友善的錯誤訊息
  getUserMessage(code: ErrorCode): string {
    return ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR];
  }
}

// 匯出單例
export const errorService = ErrorService.getInstance();
