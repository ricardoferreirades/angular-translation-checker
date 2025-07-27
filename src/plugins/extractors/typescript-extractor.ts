import { 
  ExtractorPlugin, 
  PluginContext, 
  TranslationKey,
  Logger 
} from '../../types';

export class TypeScriptExtractor implements ExtractorPlugin {
  readonly name = 'typescript-extractor';
  readonly version = '1.0.0';
  readonly description = 'Extracts translation keys from TypeScript files';
  readonly supportedExtensions = ['.ts', '.tsx'];

  private logger!: Logger;

  async initialize(context: PluginContext): Promise<void> {
    this.logger = context.logger;
    this.logger.debug('TypeScript extractor initialized');
  }

  async extractKeys(filePath: string, content: string): Promise<TranslationKey[]> {
    const keys: TranslationKey[] = [];
    
    try {
      // Pattern for translate.get('key'), translate.instant('key'), etc.
      const translatePatterns = [
        /translate\.(?:get|instant|stream)\(['"`]([^'"`]+)['"`]/g,
        /this\.translate\.(?:get|instant|stream)\(['"`]([^'"`]+)['"`]/g,
        /this\.translateService\.(?:get|instant|stream)\(['"`]([^'"`]+)['"`]/g,
      ];

      // Pattern for pipe usage: 'key' | translate
      const pipePattern = /['"`]([^'"`]+)['"`]\s*\|\s*translate/g;

      // Process translate method calls
      for (const pattern of translatePatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          keys.push(this.createTranslationKey(match[1], filePath, content, match.index));
        }
      }

      // Process pipe usage
      let pipeMatch;
      while ((pipeMatch = pipePattern.exec(content)) !== null) {
        keys.push(this.createTranslationKey(pipeMatch[1], filePath, content, pipeMatch.index));
      }

      // Pattern for dynamic key construction
      const dynamicPatterns = [
        /translate\.(?:get|instant|stream)\(\s*([^'"`\)]+)\s*\)/g,
        /['"`]([^'"`]*\$\{[^}]+\}[^'"`]*)['"`]\s*\|\s*translate/g,
      ];

      for (const pattern of dynamicPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const key = match[1].trim();
          if (this.isDynamicKey(key)) {
            keys.push(this.createTranslationKey(
              key, 
              filePath, 
              content, 
              match.index, 
              'dynamic'
            ));
          }
        }
      }

    } catch (error) {
      this.logger.warn(`Error extracting keys from ${filePath}: ${error}`);
    }

    return keys;
  }

  private createTranslationKey(
    key: string, 
    filePath: string, 
    content: string, 
    index: number,
    context?: string
  ): TranslationKey {
    const lines = content.substring(0, index).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    return {
      key: key.trim(),
      file: filePath,
      line,
      column,
      context
    };
  }

  private isDynamicKey(key: string): boolean {
    // Check for variable references, template literals, concatenation, etc.
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*/.test(key) || // Variable reference
           key.includes('${') ||                      // Template literal
           key.includes('+') ||                       // Concatenation
           key.includes('[') ||                       // Array access
           key.includes('.');                         // Property access
  }
}
