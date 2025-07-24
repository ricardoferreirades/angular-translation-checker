# API Reference

This section provides comprehensive documentation for the Angular Translation Checker API, including all available functions, options, and return values.

## Core Functions

### `checkTranslations(config)`

Main function that analyzes translation usage in your Angular project.

**Parameters:**
- `config` (Object): Configuration object

**Returns:**
- `Promise<Object>`: Analysis results

**Example:**
```javascript
const { checkTranslations } = require('angular-translation-checker');

const config = {
  srcPath: './src',
  translationsPath: './src/assets/i18n',
  languages: ['en', 'es', 'fr']
};

checkTranslations(config).then(results => {
  console.log(results);
});
```

### `formatOutput(results, config)`

Formats analysis results for console output.

**Parameters:**
- `results` (Object): Analysis results from `checkTranslations()`
- `config` (Object): Configuration object

**Returns:**
- `string`: Formatted console output

**Example:**
```javascript
const { checkTranslations, formatOutput } = require('angular-translation-checker');

const results = await checkTranslations(config);
const output = formatOutput(results, config);
console.log(output);
```

### `formatJSON(results, config)`

Formats analysis results as JSON.

**Parameters:**
- `results` (Object): Analysis results
- `config` (Object): Configuration object

**Returns:**
- `string`: JSON formatted output

### `formatCSV(results, config)`

Formats analysis results as CSV.

**Parameters:**
- `results` (Object): Analysis results
- `config` (Object): Configuration object

**Returns:**
- `string`: CSV formatted output

## Configuration Object

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `srcPath` | string | Path to source code directory |
| `translationsPath` | string | Path to translation files |
| `defaultLanguage` | string | Default language code |

### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `project` | string | `"angular-app"` | Project name |
| `languages` | string[] | `["en"]` | Language codes |
| `keySeparator` | string | `"."` | Translation key separator |
| `outputSections` | string[] | All sections | Sections to include in output |
| `format` | string | `"console"` | Output format |
| `exitOnIssues` | boolean | `false` | Exit with error code if issues found |
| `ignoreKeys` | string[] | `[]` | Keys to ignore (supports wildcards) |
| `ignoreDynamicKeys` | boolean | `false` | Ignore dynamic key patterns |
| `maxUnused` | number | `undefined` | Maximum allowed unused keys |
| `maxMissing` | number | `undefined` | Maximum allowed missing keys |

### Pattern Configuration

```javascript
{
  patterns: {
    typescript: ['*.ts', '*.tsx'],
    html: ['*.html'],
    javascript: ['*.js', '*.jsx']
  }
}
```

## Results Object

The analysis results object contains the following structure:

```javascript
{
  // Summary information
  summary: {
    totalKeys: number,
    usedKeys: number,
    unusedKeys: number,
    missingKeys: number,
    languages: string[],
    coverage: number
  },
  
  // Detailed results
  usedKeys: string[],
  unusedKeys: string[],
  missingKeys: {
    [language]: string[]
  },
  translationKeys: {
    [language]: string[]
  },
  
  // Analysis details
  dynamicPatterns: string[],
  ignoredKeys: string[],
  
  // Configuration used
  config: Object
}
```

## Output Sections

### Available Sections

| Section | Description |
|---------|-------------|
| `summary` | Overview statistics and coverage |
| `missing` | Keys used in code but missing from translations |
| `unused` | Keys in translations but not used in code |
| `usedKeys` | All keys found in source code |
| `translationKeys` | All keys found in translation files |
| `dynamicPatterns` | Dynamic key patterns detected |
| `ignored` | Keys that were ignored during analysis |
| `config` | Configuration used for analysis |

### Section Filtering

```javascript
// Include only specific sections
const config = {
  outputSections: ['summary', 'missing', 'unused']
};

// All sections (default)
const config = {
  outputSections: [
    'summary',
    'missing', 
    'unused',
    'usedKeys',
    'translationKeys',
    'dynamicPatterns',
    'ignored',
    'config'
  ]
};
```

## Error Handling

### Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success, no issues found |
| `1` | Issues found (when `exitOnIssues: true`) |
| `2` | Configuration error |
| `3` | File system error |

### Error Types

```javascript
try {
  const results = await checkTranslations(config);
} catch (error) {
  if (error.code === 'CONFIG_ERROR') {
    console.error('Configuration error:', error.message);
  } else if (error.code === 'FILE_ERROR') {
    console.error('File system error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## CLI Integration

### Command Line Options

| Option | Alias | Type | Description |
|--------|-------|------|-------------|
| `--config` | `-c` | string | Configuration file path |
| `--output` | `-o` | string | Output sections (comma-separated) |
| `--format` | `-f` | string | Output format (console/json/csv) |
| `--exit-on-issues` | | boolean | Exit with error if issues found |
| `--help` | `-h` | | Show help information |
| `--version` | `-v` | | Show version information |

### Programmatic CLI Usage

```javascript
const { exec } = require('child_process');

exec('ng-i18n-check --output summary --format json', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  const results = JSON.parse(stdout);
  console.log('Analysis complete:', results);
});
```

## Advanced Usage

### Custom Pattern Matching

```javascript
const config = {
  patterns: {
    // Custom TypeScript patterns
    typescript: [
      '**/*.ts',
      '!**/*.spec.ts',
      '!**/*.test.ts',
      '!**/node_modules/**'
    ],
    
    // Custom HTML patterns
    html: [
      '**/*.html',
      '**/*.component.html',
      '!**/test/**'
    ]
  }
};
```

### Dynamic Key Detection

```javascript
const config = {
  // Enable dynamic key pattern detection
  ignoreDynamicKeys: false,
  
  // Custom ignore patterns for dynamic keys
  ignoreKeys: [
    'dynamic.*',
    'generated.*',
    '*.temp.*'
  ]
};
```

### Multi-Project Analysis

```javascript
const projects = [
  { name: 'web-app', srcPath: './apps/web/src' },
  { name: 'mobile-app', srcPath: './apps/mobile/src' },
  { name: 'admin-app', srcPath: './apps/admin/src' }
];

for (const project of projects) {
  const config = {
    ...baseConfig,
    project: project.name,
    srcPath: project.srcPath
  };
  
  const results = await checkTranslations(config);
  console.log(`Results for ${project.name}:`, results);
}
```

## TypeScript Definitions

```typescript
interface Config {
  srcPath: string;
  translationsPath: string;
  defaultLanguage: string;
  project?: string;
  languages?: string[];
  keySeparator?: string;
  outputSections?: OutputSection[];
  format?: 'console' | 'json' | 'csv';
  exitOnIssues?: boolean;
  ignoreKeys?: string[];
  ignoreDynamicKeys?: boolean;
  maxUnused?: number;
  maxMissing?: number;
  patterns?: {
    typescript?: string[];
    html?: string[];
    javascript?: string[];
  };
}

type OutputSection = 
  | 'summary'
  | 'missing'
  | 'unused'
  | 'usedKeys'
  | 'translationKeys'
  | 'dynamicPatterns'
  | 'ignored'
  | 'config';

interface Results {
  summary: {
    totalKeys: number;
    usedKeys: number;
    unusedKeys: number;
    missingKeys: number;
    languages: string[];
    coverage: number;
  };
  usedKeys: string[];
  unusedKeys: string[];
  missingKeys: Record<string, string[]>;
  translationKeys: Record<string, string[]>;
  dynamicPatterns: string[];
  ignoredKeys: string[];
  config: Config;
}

declare function checkTranslations(config: Config): Promise<Results>;
declare function formatOutput(results: Results, config: Config): string;
declare function formatJSON(results: Results, config: Config): string;
declare function formatCSV(results: Results, config: Config): string;
```

Need more help? Check out our [examples](/examples) or [troubleshooting guide](/guide/troubleshooting).
