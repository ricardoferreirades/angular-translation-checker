import { 
  FormatterPlugin, 
  PluginContext, 
  AnalysisResult, 
  OutputSection,
  Logger 
} from '../../types';

export class JsonFormatter implements FormatterPlugin {
  readonly name = 'json-formatter';
  readonly version = '1.0.0';
  readonly description = 'Formats analysis results as structured JSON';
  readonly outputFormat = 'json' as const;

  private logger!: Logger;

  async initialize(context: PluginContext): Promise<void> {
    this.logger = context.logger;
    this.logger.debug('JSON formatter initialized');
  }

  async format(result: AnalysisResult, sections: OutputSection[]): Promise<string> {
    // Create structured JSON report
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        tool: 'angular-translation-checker',
        version: '2.0.0-typescript',
        analyzedFiles: result.config.srcPath,
        localesPath: result.config.localesPath
      },
      summary: result.summary,
      analysis: {} as any
    };

    // Include requested sections
    if (sections.includes('missing')) {
      report.analysis.missingKeys = result.missingKeys?.map(key => ({
        key: key.key,
        file: key.file,
        line: key.line,
        column: key.column,
        context: key.context
      }));
    }

    if (sections.includes('unused')) {
      report.analysis.unusedKeys = result.unusedKeys;
    }

    if (sections.includes('dynamicPatterns')) {
      report.analysis.dynamicPatterns = result.dynamicPatterns;
    }

    if (sections.includes('usedKeys')) {
      report.analysis.usedKeys = result.usedKeys?.map(key => ({
        key: key.key,
        file: key.file,
        line: key.line,
        column: key.column,
        context: key.context
      }));
    }

    if (sections.includes('translationKeys')) {
      report.analysis.translationFiles = result.translationFiles?.map(file => ({
        language: file.language,
        path: file.path,
        keyCount: Object.keys(file.keys).length,
        keys: file.keys
      }));
    }

    if (sections.includes('config')) {
      report.analysis.configuration = result.config;
    }

    return JSON.stringify(report, null, 2);
  }
}
