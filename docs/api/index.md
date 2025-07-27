# API Reference - TypeScript Edition

This section provides comprehensive documentation for the Angular Translation Checker TypeScript API, including all available functions, types, and interfaces with full type safety.

## 🚀 TypeScript-First API (v1.5.0)

The new TypeScript architecture provides full type safety, IntelliSense support, and modern development experience.

### Installation

```bash
npm install angular-translation-checker
```

### TypeScript Import

```typescript
import {
  analyzeTranslations,
  AnalysisConfig,
  AnalysisResult,
  OutputFormat,
  OutputSection
} from 'angular-translation-checker';
```

## Core Functions

### `analyzeTranslations(configPath?, configOverrides?)`

Main async function that analyzes translation usage in your Angular project with full TypeScript support.

**Type Signature:**
```typescript
async function analyzeTranslations(
  configPath?: string,
  configOverrides?: Partial<AnalysisConfig>
): Promise<{
  result: AnalysisResult;
  output: string;
  hasIssues: boolean;
}>
```

**Parameters:**
- `configPath` (string, optional): Path to configuration file
- `configOverrides` (Partial<AnalysisConfig>, optional): Configuration overrides

**Returns:**
- `Promise<{ result: AnalysisResult; output: string; hasIssues: boolean }>`: Complete analysis results

**TypeScript Example:**
```typescript
import { analyzeTranslations, AnalysisConfig } from 'angular-translation-checker';

const config: Partial<AnalysisConfig> = {
  localesPath: './src/assets/i18n',
  srcPath: './src',
  outputFormat: 'json'
};

const { result, output, hasIssues } = await analyzeTranslations(undefined, config);

// Full type safety and IntelliSense
console.log(`Found ${result.summary.totalTranslations} translations`);
console.log(`Coverage: ${result.summary.coverage}%`);

if (hasIssues) {
  console.log('Translation issues found!');
  process.exit(1);
}
```

**JavaScript Example (still supported):**
```javascript
const { analyzeTranslations } = require('angular-translation-checker');

const config = {
  localesPath: './src/assets/i18n',
  srcPath: './src'
};

const { result, output, hasIssues } = await analyzeTranslations(undefined, config);
console.log(output);
```

### Plugin System Functions

For advanced usage, you can also work directly with the plugin system:

```typescript
import { 
  createTranslationChecker,
  TranslationChecker,
  ConsoleFormatter,
  JsonFormatter 
} from 'angular-translation-checker';

// Create a checker instance
const checker = await createTranslationChecker();

// Initialize with configuration
const config = await checker.initialize('./config.json');

// Run analysis
const result = await checker.analyze(config);

// Format output
const output = await checker.format(result, 'console', ['summary', 'unused']);

console.log(output);

// Always cleanup
await checker.cleanup();
```## Configuration Object

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `srcPath` | string | Path to source code directory |
| `localesPath` | string | Path to translation files directory |

### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `keysExtensions` | string[] | `['.ts', '.html']` | File extensions to scan |
| `configFile` | string | `'./i18n-checker.config.json'` | Configuration file path |
| `excludeDirs` | string[] | `['node_modules', 'dist', '.git', '.angular', 'coverage']` | Directories to exclude |
| `outputFormat` | string | `'console'` | Output format (console/json/csv) |
| `outputSections` | string[] | All sections | Sections to include in output |
| `exitOnIssues` | boolean | `false` | Exit with error code if issues found |
| `verbose` | boolean | `false` | Enable verbose output |

### Basic Configuration Example

```javascript
const { analyzeTranslations } = require('angular-translation-checker');

const config = {
  srcPath: './src',
  localesPath: './src/assets/i18n',
  outputSections: ['summary', 'unused', 'missing']
};

const results = analyzeTranslations(config);
console.log(results);
```

## Results Object

The analysis results object contains the following structure:

```javascript
{
  // Count information
  totalKeys: number,                  // Total keys in translation files
  usedKeysCount: number,              // Count of keys used in source code
  dynamicMatchedKeysCount: number,    // Count of keys matched by dynamic patterns
  ignoredKeysCount: number,           // Count of ignored keys
  
  // Key arrays
  unusedKeys: string[],               // Keys in translations but not used in code
  missingKeys: string[],              // Keys used in code but missing from translations
  ignoredKeys: string[],              // Keys that were ignored during analysis
  translationKeys: string[],          // All keys found in translation files
  usedKeys: string[],                 // All keys found in source code
  dynamicMatchedKeys: string[],       // Keys matched by dynamic patterns
  dynamicPatterns: string[],          // Dynamic patterns detected
  
  // Analysis details
  patternMatches: object,             // Pattern matching details
  config: object                      // Configuration used for analysis
}
```

## Output Sections

### Available Sections

| Section | Description |
|---------|-------------|
| `summary` | Overview statistics and counts |
| `dynamicPatterns` | Dynamic key patterns detected |
| `ignored` | Keys that were ignored during analysis |
| `unused` | Keys in translations but not used in code |
| `missing` | Keys used in code but missing from translations |
| `usedKeys` | All keys found in source code (verbose) |
| `translationKeys` | All keys found in translation files (verbose) |
| `config` | Configuration used for analysis (verbose) |

### Output Formatting

The `analyzeTranslations()` function returns formatted output directly. For custom formatting, use the plugin system:

```typescript
import { analyzeTranslations, JsonFormatter, ConsoleFormatter } from 'angular-translation-checker';

// Get formatted output directly from main function
const { output, result, hasIssues } = await analyzeTranslations('./config.json');
console.log(output);

// Or use formatters directly with results
const jsonFormatter = new JsonFormatter();
const jsonOutput = await jsonFormatter.format(result, {});

const consoleFormatter = new ConsoleFormatter();
const consoleOutput = await consoleFormatter.format(result, { sections: ['summary', 'unused'] });
```

## Available Functions and Classes

The following TypeScript functions and classes are exported from the library:

```typescript
import {
  // Main API Functions
  analyzeTranslations,        // Main analysis function
  createTranslationChecker,   // Create checker instance
  registerBuiltInPlugins,     // Register default plugins
  
  // Core Classes
  TranslationChecker,         // Main checker class
  PluginManager,              // Plugin management
  
  // Built-in Plugins
  NgxTranslateExtractor,      // Extract ngx-translate keys
  CodeUsageAnalyzer,          // Analyze code usage
  ConsoleFormatter,           // Console output
  JsonFormatter,              // JSON output
  MarkdownFormatter,          // Markdown output
  CsvFormatter,               // CSV output
  
  // Configuration
  loadConfig,                 // Load configuration from file
  detectProjectStructure,     // Auto-detect project structure
  generateConfig,             // Generate default config file
  defaultConfig               // Default configuration object
} from 'angular-translation-checker';
```

## CLI Integration

### Command Line Options

| Option | Alias | Type | Description |
|--------|-------|------|-------------|
| `--config` | `-c` | string | Configuration file path |
| `--src-path` | `-s` | string | Source code directory path |
| `--locales-path` | `-l` | string | Translation files directory path |
| `--output` | `-o` | string | Output sections (comma-separated) |
| `--format` | `-f` | string | Output format (console/json/csv) |
| `--ignore-keys` | | string | Keys to ignore (comma-separated) |
| `--ignore-patterns` | | string | Patterns to ignore (comma-separated) |
| `--ignore-files` | | string | Files to ignore (comma-separated) |
| `--exit-on-issues` | | boolean | Exit with error if issues found |
| `--verbose` | `-v` | boolean | Enable verbose output |
| `--help` | `-h` | | Show help information |
| `--version` | | | Show version information |

### Basic CLI Usage

```bash
# Basic analysis
ng-i18n-check

# With specific paths
ng-i18n-check --src-path ./src --locales-path ./assets/i18n

# Output only specific sections
ng-i18n-check --output summary,missing,unused

# JSON format for CI/CD
ng-i18n-check --format json --exit-on-issues
```

## TypeScript Definitions

```typescript
interface Config {
  srcPath: string;
  localesPath: string;
  keysExtensions?: string[];
  configFile?: string;
  excludeDirs?: string[];
  outputFormat?: 'console' | 'json' | 'csv';
  outputSections?: OutputSection[];
  exitOnIssues?: boolean;
  verbose?: boolean;
}

type OutputSection = 
  | 'summary'
  | 'dynamicPatterns'
  | 'ignored'
  | 'unused'
    | 'missing'
  | 'usedKeys'
  | 'translationKeys'
  | 'config';

## TypeScript Type Definitions

```typescript
// Main API function signature
declare function analyzeTranslations(
  configPath?: string,
  configOverrides?: Partial<AnalysisConfig>
): Promise<{
  result: AnalysisResult;
  output: string;
  hasIssues: boolean;
}>;

// Plugin system functions
declare function createTranslationChecker(): Promise<TranslationChecker>;
declare function registerBuiltInPlugins(pluginManager: PluginManager): Promise<void>;

// Configuration functions
declare function loadConfig(configPath?: string): Promise<AnalysisConfig>;
declare function generateConfig(projectPath: string): Promise<void>;
declare function detectProjectStructure(projectPath: string): Promise<Partial<AnalysisConfig>>;

// Core interfaces
interface AnalysisConfig {
  localesPath: string;
  srcPath: string;
  ignorePaths?: string[];
  ignoreKeys?: string[];
  languages: string[];
  defaultLanguage: string;
  outputFormat: 'console' | 'json' | 'markdown' | 'csv';
  plugins?: {
    extractors?: PluginConfig[];
    analyzers?: PluginConfig[];
    formatters?: PluginConfig[];
    validators?: PluginConfig[];
    reporters?: PluginConfig[];
  };
}

interface AnalysisResult {
  summary: {
    totalTranslations: number;
    usedTranslations: number;
    unusedTranslations: number;
    missingTranslations: number;
    coverage: number;
  };
  issues: {
    unused: UnusedTranslation[];
    missing: MissingTranslation[];
    duplicates: DuplicateTranslation[];
    malformed: MalformedTranslation[];
  };
  suggestions: string[];
  performance: {
    analysisTime: number;
    memoryUsage: number;
    filesProcessed: number;
  };
}

interface UnusedTranslation {
  key: string;
  path?: string;
  line?: number;
  languages: string[];
}

interface MissingTranslation {
  key: string;
  path?: string;
  line?: number;
  languages: string[];
}

interface TranslationChecker {
  initialize(configPath?: string): Promise<AnalysisConfig>;
  analyze(config: AnalysisConfig): Promise<AnalysisResult>;
  format(result: AnalysisResult, format: string, sections?: string[]): Promise<string>;
  cleanup(): Promise<void>;
}
```

Need more help? Check out our [examples](/examples/) or [troubleshooting guide](/guide/troubleshooting).

interface Results {
  totalKeys: number;
  usedKeysCount: number;
  dynamicMatchedKeysCount: number;
  ignoredKeysCount: number;
  unusedKeys: string[];
  missingKeys: string[];
  ignoredKeys: string[];
  translationKeys: string[];
  usedKeys: string[];
  dynamicMatchedKeys: string[];
  dynamicPatterns: string[];
  patternMatches: Record<string, string[]>;
  config: Config;
}

declare function analyzeTranslations(config: Config): Results;
declare function formatOutput(results: Results, format: string, sections?: OutputSection[]): string;
declare function loadConfig(configPath?: string): Config;
declare function getTranslationKeys(localesPath: string): string[];
declare function findTranslationUsage(srcPath: string, keys: string[]): string[];
```

Need more help? Check out our [examples](/examples/) or [troubleshooting guide](/guide/troubleshooting).
