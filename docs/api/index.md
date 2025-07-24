# API Reference

This section provides comprehensive documentation for the Angular Translation Checker API, including all available functions, options, and return values.

## Core Functions

### `analyzeTranslations(config)`

Main function that analyzes translation usage in your Angular project.

**Parameters:**
- `config` (Object): Configuration object

**Returns:**
- `Object`: Analysis results (synchronous)

**Example:**
```javascript
const { analyzeTranslations } = require('angular-translation-checker');

const config = {
  srcPath: './src',
  localesPath: './src/assets/i18n'
};

const results = analyzeTranslations(config);
console.log(results);
```

### `formatOutput(results, format, sections)`

Formats analysis results for different output types.

**Parameters:**
- `results` (Object): Analysis results from `analyzeTranslations()`
- `format` (string): Output format ('console', 'json', 'csv')
- `sections` (Array): Optional array of sections to include

**Returns:**
- `string`: Formatted output

**Example:**
```javascript
const { analyzeTranslations, formatOutput } = require('angular-translation-checker');

const results = analyzeTranslations(config);
const output = formatOutput(results, 'console', ['summary', 'unused']);
console.log(output);
```

### JSON Output

To get JSON formatted output, use `formatOutput()` with 'json' format:

```javascript
const { analyzeTranslations, formatOutput } = require('angular-translation-checker');

const results = analyzeTranslations(config);
const jsonOutput = formatOutput(results, 'json');
console.log(jsonOutput);
```

### CSV Output

To get CSV formatted output, use `formatOutput()` with 'csv' format:

```javascript
const { analyzeTranslations, formatOutput } = require('angular-translation-checker');

const results = analyzeTranslations(config);
const csvOutput = formatOutput(results, 'csv');
console.log(csvOutput);
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

### Section Filtering

```javascript
const { analyzeTranslations, formatOutput } = require('angular-translation-checker');

// Include only specific sections
const results = analyzeTranslations(config);
const output = formatOutput(results, 'console', ['summary', 'missing', 'unused']);
console.log(output);

// All sections (default)
const allOutput = formatOutput(results, 'console');
console.log(allOutput);
```

## Available Functions

The following functions are exported from the library:

```javascript
const {
  analyzeTranslations,    // Main analysis function
  getTranslationKeys,     // Get keys from translation files
  findTranslationUsage,   // Find key usage in source code
  loadConfig,             // Load configuration from file
  formatOutput,           // Format results for output
  detectProjectStructure, // Auto-detect project structure
  generateConfig,         // Generate default config file
  defaultConfig           // Default configuration object
} = require('angular-translation-checker');
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

Need more help? Check out our [examples](/examples) or [troubleshooting guide](/guide/troubleshooting).
