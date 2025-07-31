// Integration test for Translation Key Analysis feature
import { TranslationKey } from '../types';

describe('Translation Key Analysis Integration', () => {
  it('should extract and analyze translation keys', async () => {
    const config = {
      localesPath: './test/fixtures/i18n',
      srcPath: './test/fixtures/src',
      patterns: {
        typescript: ['**/*.ts'],
        html: ['**/*.html']
      },
      outputFormat: 'json',
      outputSections: ['translationKeys', 'usedKeys', 'summary']
    };

    const { result } = await require('../index').analyzeTranslations(undefined, config);

    // Assert translation keys are extracted
    expect(result.translationFiles).toBeDefined();
    expect(result.translationFiles.length).toBeGreaterThan(0);
    expect(Array.isArray(result.translationFiles[0].keys)).toBe(false); // keys is an object
    expect(Object.keys(result.translationFiles[0].keys)).toContain('welcome');

    // Assert used keys are analyzed
    expect(Array.isArray(result.usedKeys)).toBe(true);
    expect(result.usedKeys.length).toBeGreaterThan(0);
    expect(result.usedKeys.some((k: TranslationKey) => k.key === 'welcome')).toBe(true);

    // Assert summary counts
    expect(result.summary.totalTranslations).toBeGreaterThan(0);
    expect(result.summary.totalUsedKeys).toBeGreaterThan(0);
  });
});
