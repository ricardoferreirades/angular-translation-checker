import {
  AnalyzerPlugin,
  PluginContext,
  AnalysisContext,
  AnalysisResult,
  TranslationKey,
  TranslationFile,
  Logger
} from '../../types';

export class CoreAnalyzer implements AnalyzerPlugin {
  readonly name = 'core-analyzer';
  readonly version = '1.0.0';
  readonly description = 'Core translation analysis functionality';

  private logger!: Logger;

  async initialize(context: PluginContext): Promise<void> {
    this.logger = context.logger;
    this.logger.debug('Core analyzer initialized');
  }

  async analyze(context: AnalysisContext): Promise<Partial<AnalysisResult>> {
    const { config, translationFiles, extractedKeys } = context;

    // Get all available translation keys
    const allTranslationKeys = this.getAllTranslationKeys(translationFiles);
    
    // Get used keys (extracted from source)
    const usedKeys = this.filterStaticKeys(extractedKeys);
    const usedKeyStrings = new Set(usedKeys.map(k => k.key));

    // Apply ignore patterns
    const ignoredKeys = this.applyIgnorePatterns(allTranslationKeys, config.ignoreKeys || []);
    const ignoredKeySet = new Set(ignoredKeys);

    // Calculate unused keys
    const unusedKeys = allTranslationKeys.filter(key => 
      !usedKeyStrings.has(key) && !ignoredKeySet.has(key)
    );

    // Calculate missing keys
    const translationKeySet = new Set(allTranslationKeys);
    const missingKeys = usedKeys.filter(key => 
      !translationKeySet.has(key.key) && !ignoredKeySet.has(key.key)
    );

    // Handle dynamic patterns
    const dynamicPatterns = this.processDynamicPatterns(
      extractedKeys.filter(k => k.context === 'dynamic'),
      allTranslationKeys,
      config.ignoreDynamicKeys || false
    );

    // Calculate coverage
    const totalTranslations = allTranslationKeys.length;
    const totalUsedKeys = usedKeyStrings.size;
    const coverage = totalTranslations > 0 ? 
      Math.round((totalUsedKeys / totalTranslations) * 100) : 0;

    const result: Partial<AnalysisResult> = {
      summary: {
        totalTranslations,
        totalUsedKeys,
        totalUnusedKeys: unusedKeys.length,
        totalMissingKeys: missingKeys.length,
        coverage,
        languages: translationFiles.map(f => f.language)
      },
      usedKeys,
      unusedKeys,
      missingKeys,
      dynamicPatterns,
      ignoredKeys
    };

    this.logger.debug(`Analysis complete: ${totalUsedKeys} used, ${unusedKeys.length} unused, ${missingKeys.length} missing`);
    
    return result;
  }

  private getAllTranslationKeys(translationFiles: TranslationFile[]): string[] {
    const keys = new Set<string>();
    
    for (const file of translationFiles) {
      this.extractKeysFromObject(file.keys, '', keys);
    }
    
    return Array.from(keys);
  }

  private extractKeysFromObject(
    obj: any, 
    prefix: string, 
    keys: Set<string>
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        this.extractKeysFromObject(value, fullKey, keys);
      } else {
        keys.add(fullKey);
      }
    }
  }

  private filterStaticKeys(keys: TranslationKey[]): TranslationKey[] {
    return keys.filter(key => key.context !== 'dynamic');
  }

  private applyIgnorePatterns(keys: string[], ignorePatterns: string[]): string[] {
    const ignoredKeys: string[] = [];
    
    for (const key of keys) {
      for (const pattern of ignorePatterns) {
        if (this.matchesPattern(key, pattern)) {
          ignoredKeys.push(key);
          break;
        }
      }
    }
    
    return ignoredKeys;
  }

  private matchesPattern(key: string, pattern: string): boolean {
    // Convert wildcard pattern to regex
    let regexPattern = pattern
      .replace(/\*\*/g, '.*')      // ** matches anything
      .replace(/\*/g, '[^.]*')     // * matches anything except dots
      .replace(/\./g, '\\.')       // Escape dots
      .replace(/\?/g, '.');        // ? matches single character

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(key);
  }

  private processDynamicPatterns(
    dynamicKeys: TranslationKey[],
    allKeys: string[],
    ignoreDynamic: boolean
  ): { pattern: string; matches: string[] }[] {
    if (ignoreDynamic) {
      return [];
    }

    const patterns = new Map<string, string[]>();
    
    for (const dynamicKey of dynamicKeys) {
      const pattern = this.extractPattern(dynamicKey.key);
      if (pattern) {
        const matches = allKeys.filter(key => this.matchesPattern(key, pattern));
        if (matches.length > 0) {
          patterns.set(pattern, matches);
        }
      }
    }
    
    return Array.from(patterns.entries()).map(([pattern, matches]) => ({
      pattern,
      matches
    }));
  }

  private extractPattern(dynamicKey: string): string | null {
    // Try to extract a pattern from dynamic key construction
    // This is a simplified version - in practice, you might use AST analysis
    
    // Handle template literals like `errors.${type}.message`
    if (dynamicKey.includes('${')) {
      return dynamicKey.replace(/\$\{[^}]+\}/g, '*');
    }
    
    // Handle variable concatenation patterns
    if (dynamicKey.includes('+')) {
      // This would require more sophisticated parsing
      return null;
    }
    
    // Handle property access patterns
    if (dynamicKey.includes('.')) {
      return dynamicKey + '.*';
    }
    
    return null;
  }
}
