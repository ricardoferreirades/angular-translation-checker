// Integration test for Source Code Scanning feature
import { TranslationKey } from '../types';

describe('Source Code Scanning Integration', () => {
  it('should scan source code for translation usage', async () => {
    // Use a test config pointing to sample i18n and src folders
    const config = {
      localesPath: './test/fixtures/i18n',
      srcPath: './test/fixtures/src',
      patterns: {
        typescript: ['**/*.ts'],
        html: ['**/*.html']
      },
      outputFormat: 'json',
      outputSections: ['usedKeys', 'dynamicPatterns', 'summary']
    };


    // Run analysis
    const { result } = await require('../index').analyzeTranslations(undefined, config);

    // Basic assertions
    expect(result).toBeDefined();
    expect(Array.isArray(result.usedKeys)).toBe(true);
    expect(result.usedKeys.length).toBeGreaterThan(0);
    expect(Array.isArray(result.dynamicPatterns)).toBe(true);
    expect(result.summary.totalUsedKeys).toBeGreaterThan(0);

    // Check that a known key from a fixture file is detected
    const found = result.usedKeys.some((k: TranslationKey) => k.key === 'welcome');
    expect(found).toBe(true);
  });
});
