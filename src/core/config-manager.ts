import * as fs from 'fs';
import * as path from 'path';
import { 
  AnalysisConfig, 
  DeepPartial, 
  ConfigurationError,
  Logger,
  OutputFormat,
  OutputSection 
} from '../types';

export const DEFAULT_CONFIG: AnalysisConfig = {
  localesPath: './src/assets/i18n',
  srcPath: './src',
  patterns: {
    typescript: ['**/*.ts', '**/*.tsx'],
    html: ['**/*.html'],
    javascript: ['**/*.js', '**/*.jsx']
  },
  ignoreKeys: [],
  ignoreDynamicKeys: false,
  languages: [],
  excludeDirs: ['node_modules', 'dist', '.git', '.angular', 'coverage'],
  outputFormat: 'console' as OutputFormat,
  outputSections: ['summary', 'dynamicPatterns', 'ignored', 'unused', 'missing'] as OutputSection[],
  exitOnIssues: false,
  verbose: false,
  plugins: []
};

export class ConfigurationManager {
  constructor(private logger: Logger) {}

  /**
   * Load configuration from file and merge with defaults
   */
  async loadConfig(configPath?: string): Promise<AnalysisConfig> {
    const config = { ...DEFAULT_CONFIG };

    if (configPath) {
      const fileConfig = await this.loadConfigFile(configPath);
      return this.mergeConfigs(config, fileConfig);
    }

    // Try to find config file automatically
    const autoConfigPath = await this.findConfigFile();
    if (autoConfigPath) {
      this.logger.debug(`Found configuration file: ${autoConfigPath}`);
      const fileConfig = await this.loadConfigFile(autoConfigPath);
      return this.mergeConfigs(config, fileConfig);
    }

    this.logger.debug('No configuration file found, using defaults');
    return config;
  }

  /**
   * Load configuration from a specific file
   */
  private async loadConfigFile(filePath: string): Promise<DeepPartial<AnalysisConfig>> {
    const resolvedPath = path.resolve(filePath);
    
    try {
      if (!fs.existsSync(resolvedPath)) {
        throw new ConfigurationError(`Configuration file not found: ${resolvedPath}`);
      }

      const content = fs.readFileSync(resolvedPath, 'utf8');
      const config = JSON.parse(content);
      
      this.validateConfig(config);
      return config;

    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error;
      }
      
      throw new ConfigurationError(
        `Failed to load configuration from ${resolvedPath}: ${error}`,
        { filePath: resolvedPath, originalError: error }
      );
    }
  }

  /**
   * Find configuration file automatically
   */
  private async findConfigFile(): Promise<string | null> {
    const possiblePaths = [
      './angular-translation-checker.config.json',
      './i18n-checker.config.json',
      './translation-checker.config.json',
      './package.json'
    ];

    for (const configPath of possiblePaths) {
      const resolvedPath = path.resolve(configPath);
      if (fs.existsSync(resolvedPath)) {
        if (configPath.endsWith('package.json')) {
          // Check if package.json has angular-translation-checker config
          try {
            const packageJson = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
            if (packageJson['angular-translation-checker']) {
              return resolvedPath;
            }
          } catch {
            continue;
          }
        } else {
          return resolvedPath;
        }
      }
    }

    return null;
  }

  /**
   * Merge configurations with deep merge logic
   */
  private mergeConfigs(
    base: AnalysisConfig, 
    override: DeepPartial<AnalysisConfig>
  ): AnalysisConfig {
    const result = { ...base };

    for (const [key, value] of Object.entries(override)) {
      if (value === undefined || value === null) {
        continue;
      }

      const typedKey = key as keyof AnalysisConfig;
      
      if (typeof value === 'object' && !Array.isArray(value) && base[typedKey]) {
        // Deep merge for nested objects
        (result as any)[typedKey] = {
          ...(base[typedKey] as any),
          ...value
        };
      } else {
        // Direct assignment for primitives and arrays
        (result as any)[typedKey] = value;
      }
    }

    return result;
  }

  /**
   * Validate configuration object
   */
  private validateConfig(config: any): void {
    if (typeof config !== 'object' || config === null) {
      throw new ConfigurationError('Configuration must be an object');
    }

    // Validate required paths
    if (config.localesPath && typeof config.localesPath !== 'string') {
      throw new ConfigurationError('localesPath must be a string');
    }

    if (config.srcPath && typeof config.srcPath !== 'string') {
      throw new ConfigurationError('srcPath must be a string');
    }

    // Validate arrays
    const arrayFields = ['ignoreKeys', 'languages', 'excludeDirs', 'outputSections'];
    for (const field of arrayFields) {
      if (config[field] && !Array.isArray(config[field])) {
        throw new ConfigurationError(`${field} must be an array`);
      }
    }

    // Validate output format
    if (config.outputFormat) {
      const validFormats = ['console', 'json', 'csv', 'xml', 'html'];
      if (!validFormats.includes(config.outputFormat)) {
        throw new ConfigurationError(
          `Invalid outputFormat '${config.outputFormat}'. Valid options: ${validFormats.join(', ')}`
        );
      }
    }

    // Validate output sections
    if (config.outputSections) {
      const validSections = [
        'summary', 'dynamicPatterns', 'ignored', 'unused', 
        'missing', 'usedKeys', 'translationKeys', 'config'
      ];
      
      for (const section of config.outputSections) {
        if (!validSections.includes(section)) {
          throw new ConfigurationError(
            `Invalid output section '${section}'. Valid options: ${validSections.join(', ')}`
          );
        }
      }
    }

    // Validate patterns
    if (config.patterns) {
      if (typeof config.patterns !== 'object') {
        throw new ConfigurationError('patterns must be an object');
      }
      
      for (const [key, patterns] of Object.entries(config.patterns)) {
        if (!Array.isArray(patterns)) {
          throw new ConfigurationError(`patterns.${key} must be an array`);
        }
        
        for (const pattern of patterns) {
          if (typeof pattern !== 'string') {
            throw new ConfigurationError(`All patterns in patterns.${key} must be strings`);
          }
        }
      }
    }

    // Validate plugins
    if (config.plugins) {
      if (!Array.isArray(config.plugins)) {
        throw new ConfigurationError('plugins must be an array');
      }
      
      for (const plugin of config.plugins) {
        if (typeof plugin !== 'object' || !plugin.name) {
          throw new ConfigurationError('Each plugin must be an object with a name property');
        }
      }
    }
  }

  /**
   * Generate a default configuration file
   */
  async generateConfigFile(outputPath: string = './angular-translation-checker.config.json'): Promise<void> {
    const configTemplate = {
      ...DEFAULT_CONFIG,
      // Add comments as properties (will be filtered out)
      $schema: 'Configuration schema for Angular Translation Checker',
      $description: {
        localesPath: 'Path to translation files directory',
        srcPath: 'Path to source code directory',
        patterns: 'File patterns to analyze by file type',
        ignoreKeys: 'Translation keys to ignore (supports wildcards)',
        ignoreDynamicKeys: 'Whether to ignore dynamically constructed keys',
        languages: 'Specific languages to analyze (empty = auto-detect)',
        excludeDirs: 'Directories to exclude from analysis',
        outputFormat: 'Output format: console, json, csv, xml, html',
        outputSections: 'Sections to include in output',
        exitOnIssues: 'Exit with error code if issues found',
        verbose: 'Enable verbose logging',
        plugins: 'Plugin configurations'
      }
    };

    try {
      const content = JSON.stringify(configTemplate, null, 2);
      fs.writeFileSync(outputPath, content, 'utf8');
      this.logger.info(`Configuration file generated: ${outputPath}`);
    } catch (error) {
      throw new ConfigurationError(
        `Failed to generate configuration file: ${error}`,
        { outputPath, originalError: error }
      );
    }
  }

  /**
   * Validate paths exist
   */
  async validatePaths(config: AnalysisConfig): Promise<void> {
    const errors: string[] = [];

    // Check locales path
    if (!fs.existsSync(config.localesPath)) {
      errors.push(`Locales path does not exist: ${config.localesPath}`);
    } else if (!fs.statSync(config.localesPath).isDirectory()) {
      errors.push(`Locales path is not a directory: ${config.localesPath}`);
    }

    // Check source path
    if (!fs.existsSync(config.srcPath)) {
      errors.push(`Source path does not exist: ${config.srcPath}`);
    } else if (!fs.statSync(config.srcPath).isDirectory()) {
      errors.push(`Source path is not a directory: ${config.srcPath}`);
    }

    if (errors.length > 0) {
      throw new ConfigurationError(
        `Configuration validation failed:\n${errors.join('\n')}`,
        { errors }
      );
    }
  }
}
