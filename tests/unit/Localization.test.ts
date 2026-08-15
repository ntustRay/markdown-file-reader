import { describe, expect, it } from 'vitest';
import { createTranslator, resolveLocale } from '../../src/localization';

describe('localization', () => {
  it('uses Traditional Chinese only for Traditional Chinese locales', () => {
    expect(resolveLocale('zh-TW')).toBe('zh-TW');
    expect(resolveLocale('zh-Hant-HK')).toBe('zh-TW');
    expect(resolveLocale('zh-CN')).toBe('en');
    expect(resolveLocale('ja-JP')).toBe('en');
  });

  it('provides the core workflow in both supported languages', () => {
    expect(createTranslator('en')('openFile')).toBe('Open file');
    expect(createTranslator('zh-TW')('openFile')).toBe('開啟檔案');
  });
});
