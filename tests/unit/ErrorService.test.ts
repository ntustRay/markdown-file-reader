import { describe, it, expect, beforeEach } from 'vitest';
import { ErrorService, ErrorCode, type AppError } from '../../src/services/ErrorService';

describe('ErrorService', () => {
  let errorService: ErrorService;

  beforeEach(() => {
    // Get fresh instance
    errorService = ErrorService.getInstance();
    errorService.clearLogs();
  });

  describe('createError', () => {
    it('應該建立具有正確錯誤代碼的錯誤', () => {
      const error = errorService.createError(ErrorCode.FILE_NOT_FOUND);

      expect(error.code).toBe(ErrorCode.FILE_NOT_FOUND);
      expect(error.message).toBe('找不到指定的檔案');
      expect(error.timestamp).toBeDefined();
    });

    it('應該包含詳細資訊', () => {
      const error = errorService.createError(
        ErrorCode.FILE_READ_ERROR,
        '無法讀取 test.md'
      );

      expect(error.code).toBe(ErrorCode.FILE_READ_ERROR);
      expect(error.details).toBe('無法讀取 test.md');
    });

    it('應該包含上下文資訊', () => {
      const error = errorService.createError(
        ErrorCode.FILE_WRITE_ERROR,
        '寫入失敗',
        { path: '/test/file.md', operation: 'save' }
      );

      expect(error.context).toBeDefined();
      expect(error.context?.path).toBe('/test/file.md');
      expect(error.context?.operation).toBe('save');
    });
  });

  describe('fromNativeError', () => {
    it('應該從原生 Error 物件建立 AppError', () => {
      const nativeError = new Error('Something went wrong');
      const appError = errorService.fromNativeError(nativeError);

      expect(appError.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(appError.details).toBe('Something went wrong');
    });

    it('應該推斷 FILE_NOT_FOUND 錯誤', () => {
      const nativeError = new Error('File not found: test.md');
      const appError = errorService.fromNativeError(nativeError);

      expect(appError.code).toBe(ErrorCode.FILE_NOT_FOUND);
    });

    it('應該推斷權限相關錯誤', () => {
      const nativeError = new Error('Permission denied');
      const appError = errorService.fromNativeError(nativeError);

      expect(appError.code).toBe(ErrorCode.FILE_PERMISSION_DENIED);
    });

    it('應該使用指定的預設錯誤代碼', () => {
      const nativeError = new Error('Unknown issue');
      const appError = errorService.fromNativeError(
        nativeError,
        ErrorCode.MARKDOWN_RENDER_ERROR
      );

      expect(appError.code).toBe(ErrorCode.MARKDOWN_RENDER_ERROR);
    });
  });

  describe('logging', () => {
    it('應該記錄資訊日誌', () => {
      errorService.logInfo('測試訊息', { key: 'value' });

      const logs = errorService.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe('info');
      expect(logs[0].message).toBe('測試訊息');
    });

    it('應該記錄警告日誌', () => {
      errorService.logWarn('警告訊息');

      const logs = errorService.getLogs();
      expect(logs[0].level).toBe('warn');
    });

    it('應該限制日誌數量', () => {
      // Add more than max logs
      for (let i = 0; i < 150; i++) {
        errorService.logInfo(`Log ${i}`);
      }

      const logs = errorService.getLogs();
      expect(logs.length).toBeLessThanOrEqual(100);
    });
  });

  describe('context sanitization', () => {
    it('應該隱藏敏感資訊', () => {
      const error = errorService.createError(
        ErrorCode.UNKNOWN_ERROR,
        'Test',
        {
          password: 'secret123',
          token: 'abc123',
          apikey: 'key123',
          normalField: 'visible'
        }
      );

      expect(error.context?.password).toBe('[REDACTED]');
      expect(error.context?.token).toBe('[REDACTED]');
      expect(error.context?.apikey).toBe('[REDACTED]');
      expect(error.context?.normalField).toBe('visible');
    });

    it('應該截斷過長的字串', () => {
      const longString = 'a'.repeat(300);
      const error = errorService.createError(
        ErrorCode.UNKNOWN_ERROR,
        'Test',
        { longValue: longString }
      );

      expect((error.context?.longValue as string).length).toBeLessThan(300);
      expect(error.context?.longValue).toContain('[truncated]');
    });
  });

  describe('exportLogs', () => {
    it('應該匯出 JSON 格式的日誌', () => {
      errorService.logInfo('Test log');
      const exported = errorService.exportLogs();

      expect(() => JSON.parse(exported)).not.toThrow();
      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
    });
  });

  describe('error listeners', () => {
    it('應該通知錯誤監聽器', () => {
      let receivedError: AppError | null = null;

      errorService.onError((error) => {
        receivedError = error;
      });

      errorService.createError(ErrorCode.FILE_NOT_FOUND);

      expect(receivedError).not.toBeNull();
      expect(receivedError?.code).toBe(ErrorCode.FILE_NOT_FOUND);
    });
  });

  describe('getUserMessage', () => {
    it('應該返回使用者友善的錯誤訊息', () => {
      const message = errorService.getUserMessage(ErrorCode.FILE_READ_ERROR);
      expect(message).toBe('讀取檔案時發生錯誤');
    });

    it('應該對未知錯誤代碼返回預設訊息', () => {
      const message = errorService.getUserMessage('INVALID_CODE' as ErrorCode);
      expect(message).toBe('發生未知錯誤');
    });
  });
});
