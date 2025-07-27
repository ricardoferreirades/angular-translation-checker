import { 
  ExtractorPlugin, 
  PluginContext, 
  TranslationKey,
  Logger 
} from '../../types';

export class HtmlExtractor implements ExtractorPlugin {
  readonly name = 'html-extractor';
  readonly version = '1.0.0';
  readonly description = 'Extracts translation keys from HTML template files';
  readonly supportedExtensions = ['.html'];

  private logger!: Logger;

  async initialize(context: PluginContext): Promise<void> {
    this.logger = context.logger;
    this.logger.debug('HTML extractor initialized');
  }

  async extractKeys(filePath: string, content: string): Promise<TranslationKey[]> {
    const keys: TranslationKey[] = [];
    
    try {
      // Pattern for pipe usage: 'key' | translate
      const pipePattern = /['"`]([^'"`]+)['"`]\s*\|\s*translate/g;

      // Pattern for translate directive: [translate]="'key'"
      const directivePattern = /\[translate\]=['"`]([^'"`]+)['"`]/g;

      // Pattern for translate attribute: translate="key"
      const attributePattern = /translate=['"`]([^'"`]+)['"`]/g;

      // Pattern for interpolation with translate: {{ 'key' | translate }}
      const interpolationPattern = /{{\s*['"`]([^'"`]+)['"`]\s*\|\s*translate\s*}}/g;

      const patterns = [
        pipePattern,
        directivePattern, 
        attributePattern,
        interpolationPattern
      ];

      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          keys.push(this.createTranslationKey(match[1], filePath, content, match.index));
        }
      }

      // Pattern for dynamic keys in templates
      const dynamicPatterns = [
        /\|\s*translate:\s*([^}\s]+)/g,  // | translate: variable
        /{{\s*([^'"`\s|]+)\s*\|\s*translate\s*}}/g,  // {{ variable | translate }}
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

      // Extract keys from structural directives
      const structuralDirectives = [
        /\*ngFor="[^"]*['"`]([^'"`]+)['"`][^"]*\|\s*translate/g,
        /\*ngIf="[^"]*['"`]([^'"`]+)['"`][^"]*\|\s*translate/g,
      ];

      for (const pattern of structuralDirectives) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          keys.push(this.createTranslationKey(match[1], filePath, content, match.index));
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
    // Check for variable references in templates
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*/.test(key) && // Looks like a variable
           !key.includes('.') &&                     // Not a property chain
           !key.includes("'") &&                     // Not a string literal
           !key.includes('"');                       // Not a string literal
  }
}
