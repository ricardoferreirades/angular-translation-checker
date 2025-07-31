// Integration test for Unused and Missing Key Detection feature

describe('Unused and Missing Key Detection Integration', () => {
  it('should detect unused and missing translation keys', async () => {
    // Add an unused key to the translation file
    const fs = require('fs');
    const path = require('path');
    const i18nPath = path.join(__dirname, '../../test/fixtures/i18n/en.json');
    const translations = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));
    translations.unused_key = 'Unused!';
    fs.writeFileSync(i18nPath, JSON.stringify(translations));

    const config = {
      localesPath: './test/fixtures/i18n',
      srcPath: './test/fixtures/src',
      patterns: {
        typescript: ['**/*.ts'],
        html: ['**/*.html']
      },
      outputFormat: 'json',
      outputSections: ['unusedKeys', 'missingKeys', 'summary']
    };

    const { result } = await require('../index').analyzeTranslations(undefined, config);

    // Assert unused keys are detected
    expect(Array.isArray(result.unusedKeys)).toBe(true);
    expect(result.unusedKeys.length).toBeGreaterThan(0);
    expect(result.unusedKeys).toContain('unused_key');

    // Assert missing keys are detected (if any)
    expect(Array.isArray(result.missingKeys)).toBe(true);
    // If there are missing keys, they should have a key property
    if (result.missingKeys.length > 0) {
      expect(result.missingKeys[0]).toHaveProperty('key');
    }
  });
});
