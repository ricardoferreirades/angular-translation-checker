import {
  FormatterPlugin,
  PluginContext,
  AnalysisResult,
  OutputSection,
  Logger
} from '../../types';

export class ConsoleFormatter implements FormatterPlugin {
  readonly name = 'console-formatter';
  readonly version = '1.0.0';
  readonly description = 'Formats analysis results for console output';
  readonly outputFormat = 'console' as const;

  private logger!: Logger;

  async initialize(context: PluginContext): Promise<void> {
    this.logger = context.logger;
    this.logger.debug('Console formatter initialized');
  }

  async format(result: AnalysisResult, sections: OutputSection[]): Promise<string> {
    const output: string[] = [];
    
    // Professional Header with timestamp
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const languages = result.summary.languages.join(', ');
    output.push('┌─ Angular Translation Checker Analysis ─────────────────────────┐');
    output.push(`│ Analysis completed at: ${timestamp}                │`);
    output.push(`│ Languages analyzed: ${languages.padEnd(42)} │`);
    output.push('└─────────────────────────────────────────────────────────────────┘');
    output.push('');

    // Process each requested section
    for (const section of sections) {
      switch (section) {
        case 'summary':
          output.push(...this.formatSummary(result));
          break;
        case 'dynamicPatterns':
          output.push(...this.formatDynamicPatterns(result));
          break;
        case 'ignored':
          output.push(...this.formatIgnoredKeys(result));
          break;
        case 'unused':
          output.push(...this.formatUnusedKeys(result));
          break;
        case 'missing':
          output.push(...this.formatMissingKeys(result));
          break;
        case 'usedKeys':
          output.push(...this.formatUsedKeys(result));
          break;
        case 'translationKeys':
          output.push(...this.formatTranslationKeys(result));
          break;
        case 'config':
          output.push(...this.formatConfig(result));
          break;
      }
    }

    return output.join('\n');
  }

  private formatSummary(result: AnalysisResult): string[] {
    const { summary } = result;
    const output: string[] = [];
    
    output.push('Translation Summary');
    output.push('-'.repeat(20));
    output.push(`Languages: ${summary.languages.join(', ')}`);
    output.push(`Total translations: ${summary.totalTranslations}`);
    output.push(`Used keys: ${summary.totalUsedKeys}`);
    output.push(`Unused keys: ${summary.totalUnusedKeys}`);
    output.push(`Missing keys: ${summary.totalMissingKeys}`);
    output.push(`Coverage: ${summary.coverage}%`);
    output.push('');

    return output;
  }

  private formatDynamicPatterns(result: AnalysisResult): string[] {
    const output: string[] = [];
    
    if (result.dynamicPatterns.length === 0) {
      return output;
    }

    output.push('Dynamic Patterns Detected');
    output.push('-'.repeat(30));
    
    for (const pattern of result.dynamicPatterns) {
      output.push(`Pattern: ${pattern.pattern}`);
      output.push(`Matches (${pattern.matches.length}):`);
      for (const match of pattern.matches.slice(0, 10)) { // Limit to first 10
        output.push(`  - ${match}`);
      }
      if (pattern.matches.length > 10) {
        output.push(`  ... and ${pattern.matches.length - 10} more`);
      }
      output.push('');
    }

    return output;
  }

  private formatIgnoredKeys(result: AnalysisResult): string[] {
    const output: string[] = [];
    
    if (result.ignoredKeys.length === 0) {
      return output;
    }

    output.push(`Ignored Translation Keys (${result.ignoredKeys.length})`);
    output.push('-'.repeat(35));
    
    for (const key of result.ignoredKeys.slice(0, 20)) { // Limit output
      output.push(`- ${key}`);
    }
    
    if (result.ignoredKeys.length > 20) {
      output.push(`... and ${result.ignoredKeys.length - 20} more ignored keys`);
    }
    
    output.push('');
    return output;
  }

  private formatUnusedKeys(result: AnalysisResult): string[] {
    const output: string[] = [];
    
    if (result.unusedKeys.length === 0) {
      output.push('No unused translation keys found!');
      output.push('');
      return output;
    }

    output.push(`Unused Translation Keys (${result.unusedKeys.length})`);
    output.push('-'.repeat(35));
    
    for (const key of result.unusedKeys.slice(0, 50)) { // Limit output
      output.push(`- ${key}`);
    }
    
    if (result.unusedKeys.length > 50) {
      output.push(`... and ${result.unusedKeys.length - 50} more unused keys`);
    }
    
    output.push('');
    return output;
  }

  private formatMissingKeys(result: AnalysisResult): string[] {
    const output: string[] = [];
    
    if (result.missingKeys.length === 0) {
      output.push('No missing translation keys found!');
      output.push('');
      return output;
    }

    output.push(`Missing Translation Keys (${result.missingKeys.length})`);
    output.push('-'.repeat(35));
    
    for (const keyInfo of result.missingKeys.slice(0, 50)) { // Limit output
      output.push(`- ${keyInfo.key} (${keyInfo.file}:${keyInfo.line})`);
    }
    
    if (result.missingKeys.length > 50) {
      output.push(`... and ${result.missingKeys.length - 50} more missing keys`);
    }
    
    output.push('');
    return output;
  }

  private formatUsedKeys(result: AnalysisResult): string[] {
    const output: string[] = [];
    
    output.push(`Used Translation Keys (${result.usedKeys.length})`);
    output.push('-'.repeat(30));
    
    // Group by file for better readability
    const keysByFile = new Map<string, typeof result.usedKeys>();
    
    for (const key of result.usedKeys) {
      if (!keysByFile.has(key.file)) {
        keysByFile.set(key.file, []);
      }
      keysByFile.get(key.file)!.push(key);
    }
    
    let totalShown = 0;
    for (const [file, keys] of keysByFile.entries()) {
      if (totalShown >= 100) break; // Limit total output
      
      output.push(`\nFile: ${file}`);
      for (const key of keys.slice(0, 10)) { // Limit per file
        output.push(`  - ${key.key} (line ${key.line})`);
        totalShown++;
      }
      if (keys.length > 10) {
        output.push(`  ... and ${keys.length - 10} more keys in this file`);
      }
    }
    
    output.push('');
    return output;
  }

  private formatTranslationKeys(result: AnalysisResult): string[] {
    const output: string[] = [];
    
    output.push('Available Translation Keys by Language');
    output.push('-'.repeat(45));
    
    for (const file of result.translationFiles) {
      output.push(`\nLanguage: ${file.language} (${file.path})`);
      
      const keys = this.getAllKeysFromObject(file.keys);
      output.push(`Total keys: ${keys.length}`);
      
      // Show first few keys as example
      for (const key of keys.slice(0, 10)) {
        output.push(`  - ${key}`);
      }
      
      if (keys.length > 10) {
        output.push(`  ... and ${keys.length - 10} more keys`);
      }
    }
    
    output.push('');
    return output;
  }

  private formatConfig(result: AnalysisResult): string[] {
    const output: string[] = [];
    
    output.push('Configuration');
    output.push('-'.repeat(15));
    output.push(`Source path: ${result.config.srcPath}`);
    output.push(`Locales path: ${result.config.localesPath}`);
    output.push(`Output format: ${result.config.outputFormat}`);
    output.push(`Output sections: ${result.config.outputSections?.join(', ')}`);
    output.push(`Ignore patterns: ${result.config.ignoreKeys?.join(', ') || 'none'}`);
    output.push(`Ignore dynamic keys: ${result.config.ignoreDynamicKeys ? 'yes' : 'no'}`);
    output.push(`Exclude directories: ${result.config.excludeDirs?.join(', ')}`);
    output.push('');
    
    return output;
  }

  private getAllKeysFromObject(obj: any, prefix: string = ''): string[] {
    const keys: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys.push(...this.getAllKeysFromObject(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    
    return keys;
  }
}
