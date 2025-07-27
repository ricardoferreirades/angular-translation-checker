import {
  AnalysisConfig,
  AnalysisResult,
  AnalysisContext,
  TranslationFile,
  TranslationKey,
  Logger,
  EventBus,
  FileSystemAdapter,
  TranslationCheckerError,
  OutputSection
} from '../types';

import { PluginManager } from './plugin-manager';
import { ConfigurationManager } from './config-manager';
import { ConsoleLogger } from './logger';
import { SimpleEventBus } from './event-bus';
import { NodeFileSystemAdapter } from './filesystem';

export class TranslationChecker {
  private logger: Logger;
  private eventBus: EventBus;
  private pluginManager: PluginManager;
  private configManager: ConfigurationManager;
  private fileSystem: FileSystemAdapter;

  constructor() {
    this.logger = new ConsoleLogger();
    this.eventBus = new SimpleEventBus();
    this.pluginManager = new PluginManager(this.logger, this.eventBus);
    this.configManager = new ConfigurationManager(this.logger);
    this.fileSystem = new NodeFileSystemAdapter();
  }

  /**
   * Initialize the translation checker with configuration
   */
  async initialize(configPath?: string, configOverrides?: Partial<AnalysisConfig>): Promise<AnalysisConfig> {
    try {
      this.eventBus.emit('checker:initializing', { configPath });
      
      // Load configuration
      const config = await this.configManager.loadConfig(configPath);
      
      // Apply overrides if provided
      if (configOverrides) {
        Object.assign(config, configOverrides);
      }
      
      // Set logger verbosity
      if (this.logger instanceof ConsoleLogger) {
        this.logger.setVerbose(config.verbose || false);
      }

      // Validate configuration paths
      await this.configManager.validatePaths(config);

      // Register built-in plugins
      await this.registerBuiltInPlugins(config);

      // Register custom plugins from config
      await this.registerCustomPlugins(config);

      this.eventBus.emit('checker:initialized', { config });
      this.logger.debug('Translation checker initialized successfully');

      return config;
    } catch (error) {
      const checkerError = error instanceof TranslationCheckerError 
        ? error 
        : new TranslationCheckerError('Initialization failed', 'INIT_ERROR', error);
      
      this.logger.error(checkerError.message);
      this.eventBus.emit('checker:error', { error: checkerError });
      throw checkerError;
    }
  }

  /**
   * Analyze translations based on configuration
   */
  async analyze(config: AnalysisConfig): Promise<AnalysisResult> {
    try {
      this.eventBus.emit('analysis:started', { config });
      this.logger.info('Starting translation analysis...');

      // Discover translation files
      const translationFiles = await this.discoverTranslationFiles(config);
      this.logger.debug(`Found ${translationFiles.length} translation files`);

      // Discover source files
      const sourceFiles = await this.discoverSourceFiles(config);
      this.logger.debug(`Found ${sourceFiles.length} source files`);

      // Extract translation keys from source files
      const extractedKeys = await this.extractTranslationKeys(sourceFiles, config);
      this.logger.debug(`Extracted ${extractedKeys.length} translation keys`);

      // Create analysis context
      const context: AnalysisContext = {
        config,
        sourceFiles,
        translationFiles,
        extractedKeys
      };

      // Run analyzers
      const analysisResult = await this.runAnalyzers(context);

      // Run validators
      await this.runValidators(analysisResult);

      this.eventBus.emit('analysis:completed', { result: analysisResult });
      this.logger.info('Translation analysis completed');

      return analysisResult;

    } catch (error) {
      const checkerError = error instanceof TranslationCheckerError 
        ? error 
        : new TranslationCheckerError('Analysis failed', 'ANALYSIS_ERROR', error);
      
      this.logger.error(checkerError.message);
      this.eventBus.emit('analysis:error', { error: checkerError });
      throw checkerError;
    }
  }

  /**
   * Format analysis result
   */
  async format(
    result: AnalysisResult, 
    format: string, 
    sections: OutputSection[]
  ): Promise<string> {
    try {
      const formatter = this.pluginManager.getFormatter(format);
      if (!formatter) {
        throw new TranslationCheckerError(
          `No formatter found for format '${format}'`,
          'FORMATTER_NOT_FOUND'
        );
      }

      this.logger.debug(`Formatting result with ${formatter.name}`);
      return await formatter.format(result, sections);

    } catch (error) {
      const checkerError = error instanceof TranslationCheckerError 
        ? error 
        : new TranslationCheckerError('Formatting failed', 'FORMAT_ERROR', error);
      
      this.logger.error(checkerError.message);
      throw checkerError;
    }
  }

  /**
   * Generate reports
   */
  async report(result: AnalysisResult, output: string): Promise<void> {
    const reporters = this.pluginManager.getReporters();
    
    for (const reporter of reporters) {
      try {
        await reporter.report(result, output);
      } catch (error) {
        this.logger.error(`Reporter ${reporter.name} failed: ${error}`);
      }
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.pluginManager.cleanup();
    this.eventBus.emit('checker:cleanup', {});
  }

  // Private methods

  private async registerBuiltInPlugins(config: AnalysisConfig): Promise<void> {
    // Built-in plugins will be registered here
    // For now, we'll create them in separate files
    this.logger.debug('Registering built-in plugins');
  }

  private async registerCustomPlugins(config: AnalysisConfig): Promise<void> {
    if (!config.plugins) return;

    for (const pluginConfig of config.plugins) {
      if (!pluginConfig.enabled) continue;

      try {
        // Dynamic plugin loading would go here
        this.logger.debug(`Loading custom plugin: ${pluginConfig.name}`);
      } catch (error) {
        this.logger.error(`Failed to load plugin ${pluginConfig.name}: ${error}`);
      }
    }
  }

  private async discoverTranslationFiles(config: AnalysisConfig): Promise<TranslationFile[]> {
    const files: TranslationFile[] = [];
    
    try {
      const entries = await this.fileSystem.readdir(config.localesPath);
      
      for (const entry of entries) {
        const fullPath = `${config.localesPath}/${entry}`;
        
        if (entry.endsWith('.json')) {
          const language = entry.replace('.json', '');
          const content = await this.fileSystem.readFile(fullPath);
          const keys = JSON.parse(content);
          
          files.push({
            language,
            path: fullPath,
            keys
          });
        }
      }
    } catch (error) {
      throw new TranslationCheckerError(
        `Failed to discover translation files: ${error}`,
        'DISCOVERY_ERROR'
      );
    }

    return files;
  }

  private async discoverSourceFiles(config: AnalysisConfig): Promise<string[]> {
    const files: string[] = [];
    
    try {
      if (config.patterns) {
        for (const [fileType, patterns] of Object.entries(config.patterns)) {
          for (const pattern of patterns) {
            const matches = await this.fileSystem.glob(pattern, { 
              cwd: config.srcPath 
            });
            // Convert relative paths to absolute paths
            const absolutePaths = matches.map(relativePath => 
              `${config.srcPath}/${relativePath}`
            );
            files.push(...absolutePaths);
          }
        }
      }
    } catch (error) {
      throw new TranslationCheckerError(
        `Failed to discover source files: ${error}`,
        'DISCOVERY_ERROR'
      );
    }

    return files;
  }

  private async extractTranslationKeys(
    sourceFiles: string[], 
    config: AnalysisConfig
  ): Promise<TranslationKey[]> {
    const keys: TranslationKey[] = [];
    const extractors = this.pluginManager.getExtractors();

    for (const filePath of sourceFiles) {
      const content = await this.fileSystem.readFile(filePath);
      const fileExtension = filePath.split('.').pop() || '';

      const relevantExtractors = extractors.filter(
        extractor => extractor.supportedExtensions.includes(`.${fileExtension}`)
      );

      for (const extractor of relevantExtractors) {
        try {
          const extractedKeys = await extractor.extractKeys(filePath, content);
          keys.push(...extractedKeys);
        } catch (error) {
          this.logger.warn(`Extraction failed for ${filePath} with ${extractor.name}: ${error}`);
        }
      }
    }

    return keys;
  }

  private async runAnalyzers(context: AnalysisContext): Promise<AnalysisResult> {
    const analyzers = this.pluginManager.getAnalyzers();
    
    // Initialize result with basic structure
    let result: AnalysisResult = {
      summary: {
        totalTranslations: 0,
        totalUsedKeys: 0,
        totalUnusedKeys: 0,
        totalMissingKeys: 0,
        coverage: 0,
        languages: context.translationFiles.map(f => f.language)
      },
      usedKeys: [],
      unusedKeys: [],
      missingKeys: [],
      dynamicPatterns: [],
      ignoredKeys: [],
      translationFiles: context.translationFiles,
      config: context.config
    };

    // Merge results from all analyzers
    for (const analyzer of analyzers) {
      try {
        const partialResult = await analyzer.analyze(context);
        result = this.mergeAnalysisResults(result, partialResult);
      } catch (error) {
        this.logger.error(`Analyzer ${analyzer.name} failed: ${error}`);
      }
    }

    return result;
  }

  private async runValidators(result: AnalysisResult): Promise<void> {
    const validators = this.pluginManager.getValidators();

    for (const validator of validators) {
      try {
        const validation = await validator.validate(result);
        if (!validation.isValid) {
          for (const error of validation.errors) {
            this.logger.error(`Validation error: ${error.message}`);
          }
          for (const warning of validation.warnings) {
            this.logger.warn(`Validation warning: ${warning.message}`);
          }
        }
      } catch (error) {
        this.logger.error(`Validator ${validator.name} failed: ${error}`);
      }
    }
  }

  private mergeAnalysisResults(
    base: AnalysisResult, 
    partial: Partial<AnalysisResult>
  ): AnalysisResult {
    return {
      ...base,
      ...partial,
      summary: { ...base.summary, ...partial.summary },
      usedKeys: [...base.usedKeys, ...(partial.usedKeys || [])],
      unusedKeys: [...base.unusedKeys, ...(partial.unusedKeys || [])],
      missingKeys: [...base.missingKeys, ...(partial.missingKeys || [])],
      dynamicPatterns: [...base.dynamicPatterns, ...(partial.dynamicPatterns || [])],
      ignoredKeys: [...base.ignoredKeys, ...(partial.ignoredKeys || [])]
    };
  }
}
