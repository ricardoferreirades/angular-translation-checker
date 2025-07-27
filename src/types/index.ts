// Core Types and Interfaces for Angular Translation Checker

export interface TranslationKey {
  key: string;
  file: string;
  line: number;
  column?: number;
  context?: string;
}

export interface TranslationFile {
  language: string;
  path: string;
  keys: Record<string, any>;
}

export interface AnalysisResult {
  summary: {
    totalTranslations: number;
    totalUsedKeys: number;
    totalUnusedKeys: number;
    totalMissingKeys: number;
    coverage: number;
    languages: string[];
  };
  usedKeys: TranslationKey[];
  unusedKeys: string[];
  missingKeys: TranslationKey[];
  dynamicPatterns: {
    pattern: string;
    matches: string[];
  }[];
  ignoredKeys: string[];
  translationFiles: TranslationFile[];
  config: AnalysisConfig;
}

export interface AnalysisConfig {
  localesPath: string;
  srcPath: string;
  patterns?: {
    typescript?: string[];
    html?: string[];
    javascript?: string[];
  };
  ignoreKeys?: string[];
  ignoreDynamicKeys?: boolean;
  languages?: string[];
  excludeDirs?: string[];
  outputFormat?: OutputFormat;
  outputDir?: string;
  outputSections?: OutputSection[];
  exitOnIssues?: boolean;
  verbose?: boolean;
  plugins?: PluginConfig[];
}

export type OutputFormat = 'console' | 'json' | 'csv' | 'xml' | 'html';

export type OutputSection = 
  | 'summary' 
  | 'dynamicPatterns' 
  | 'ignored' 
  | 'unused' 
  | 'missing' 
  | 'usedKeys' 
  | 'translationKeys' 
  | 'config';

export interface PluginConfig {
  name: string;
  enabled?: boolean;
  options?: Record<string, any>;
}

// Plugin System Interfaces

export interface Plugin {
  readonly name: string;
  readonly version: string;
  readonly description: string;
  initialize(context: PluginContext): Promise<void> | void;
  cleanup?(): Promise<void> | void;
}

export interface PluginContext {
  config: AnalysisConfig;
  logger: Logger;
  eventBus: EventBus;
}

export interface AnalyzerPlugin extends Plugin {
  analyze(context: AnalysisContext): Promise<Partial<AnalysisResult>>;
}

export interface ExtractorPlugin extends Plugin {
  readonly supportedExtensions: string[];
  extractKeys(filePath: string, content: string): Promise<TranslationKey[]>;
}

export interface FormatterPlugin extends Plugin {
  readonly outputFormat: OutputFormat;
  format(result: AnalysisResult, sections: OutputSection[]): Promise<string>;
}

export interface ValidatorPlugin extends Plugin {
  validate(result: AnalysisResult): Promise<ValidationResult>;
}

export interface ReporterPlugin extends Plugin {
  report(result: AnalysisResult, output: string): Promise<void>;
}

export interface AnalysisContext {
  config: AnalysisConfig;
  sourceFiles: string[];
  translationFiles: TranslationFile[];
  extractedKeys: TranslationKey[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: string;
  message: string;
  key?: string;
  file?: string;
  line?: number;
}

export interface ValidationWarning {
  type: string;
  message: string;
  key?: string;
  file?: string;
  line?: number;
}

// Event System

export interface EventBus {
  emit<T = any>(event: string, data: T): void;
  on<T = any>(event: string, handler: (data: T) => void): void;
  off(event: string, handler: Function): void;
}

export interface Logger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  verbose(message: string, ...args: any[]): void;
}

// Error Types

export class TranslationCheckerError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'TranslationCheckerError';
  }
}

export class PluginError extends TranslationCheckerError {
  constructor(
    message: string,
    public readonly pluginName: string,
    details?: any
  ) {
    super(message, 'PLUGIN_ERROR', details);
    this.name = 'PluginError';
  }
}

export class ConfigurationError extends TranslationCheckerError {
  constructor(message: string, details?: any) {
    super(message, 'CONFIG_ERROR', details);
    this.name = 'ConfigurationError';
  }
}

// Utility Types

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredConfig = Required<Pick<AnalysisConfig, 'localesPath' | 'srcPath'>>;

export interface FileSystemAdapter {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  readdir(path: string): Promise<string[]>;
  exists(path: string): Promise<boolean>;
  isDirectory(path: string): Promise<boolean>;
  glob(pattern: string, options?: any): Promise<string[]>;
}
