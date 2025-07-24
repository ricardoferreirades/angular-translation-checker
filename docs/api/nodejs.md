# Node.js API

Angular Translation Checker provides a comprehensive Node.js API for programmatic integration into your applications, build tools, and custom workflows. This reference covers all available functions, options, and usage patterns.

## Installation

```bash
npm install angular-translation-checker --save-dev
```

## Core API

### `checkTranslations(config)`

Main function that analyzes translation usage in your Angular project.

```javascript
const { checkTranslations } = require('angular-translation-checker');

async function analyzeProject() {
  const config = {
    srcPath: './src',
    translationsPath: './src/assets/i18n',
    languages: ['en', 'es', 'fr']
  };
  
  try {
    const results = await checkTranslations(config);
    console.log('Analysis complete:', results.summary);
  } catch (error) {
    console.error('Analysis failed:', error.message);
  }
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `object` | Yes | Configuration object |

#### Returns

- **Type**: `Promise<AnalysisResults>`
- **Description**: Promise that resolves to analysis results

#### Configuration Object

```javascript
const config = {
  // Required
  srcPath: './src',
  translationsPath: './src/assets/i18n',
  defaultLanguage: 'en',
  
  // Optional
  project: 'my-app',
  languages: ['en', 'es', 'fr'],
  keySeparator: '.',
  outputSections: ['summary', 'missing', 'unused'],
  ignoreKeys: ['debug.*', 'test.*'],
  ignoreDynamicKeys: false,
  maxUnused: 50,
  maxMissing: 0,
  patterns: {
    typescript: ['**/*.ts', '!**/*.spec.ts'],
    html: ['**/*.html'],
    javascript: ['**/*.js']
  }
};
```

#### Results Object

```javascript
{
  summary: {
    totalKeys: 156,
    usedKeys: 142,
    unusedKeys: 14,
    missingKeys: 3,
    languages: ['en', 'es', 'fr'],
    coverage: 91.0
  },
  usedKeys: ['common.buttons.save', 'user.profile.name'],
  unusedKeys: ['debug.old.feature', 'temp.data'],
  missingKeys: {
    en: [],
    es: ['user.profile.bio'],
    fr: ['user.profile.bio', 'settings.notifications']
  },
  translationKeys: {
    en: ['common.buttons.save', 'user.profile.name'],
    es: ['common.buttons.save'],
    fr: ['common.buttons.save']
  },
  dynamicPatterns: [
    {
      pattern: 'errors.${type}',
      locations: ['src/services/error.service.ts:45'],
      confidence: 0.92
    }
  ],
  ignoredKeys: ['debug.*', 'test.*'],
  config: { /* resolved configuration */ }
}
```

## Formatting Functions

### `formatOutput(results, config)`

Formats analysis results for console display.

```javascript
const { checkTranslations, formatOutput } = require('angular-translation-checker');

async function generateConsoleReport() {
  const results = await checkTranslations(config);
  const output = formatOutput(results, config);
  console.log(output);
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `results` | `AnalysisResults` | Yes | Results from `checkTranslations()` |
| `config` | `object` | Yes | Configuration object |

#### Returns

- **Type**: `string`
- **Description**: Formatted console output

### `formatJSON(results, config)`

Formats analysis results as JSON.

```javascript
const { checkTranslations, formatJSON } = require('angular-translation-checker');

async function generateJSONReport() {
  const results = await checkTranslations(config);
  const jsonOutput = formatJSON(results, config);
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('translation-report.json', jsonOutput);
  
  // Or parse for processing
  const report = JSON.parse(jsonOutput);
  console.log(`Coverage: ${report.summary.coverage}%`);
}
```

### `formatCSV(results, config)`

Formats analysis results as CSV.

```javascript
const { checkTranslations, formatCSV } = require('angular-translation-checker');

async function generateCSVReport() {
  const results = await checkTranslations(config);
  const csvOutput = formatCSV(results, config);
  
  const fs = require('fs');
  fs.writeFileSync('translation-report.csv', csvOutput);
}
```

## Advanced Usage

### Configuration Loading

```javascript
const { loadConfig, checkTranslations } = require('angular-translation-checker');

// Load from file
const config = await loadConfig('./translation.config.json');

// Merge with overrides
const finalConfig = {
  ...config,
  exitOnIssues: true,
  outputSections: ['missing']
};

const results = await checkTranslations(finalConfig);
```

### Multiple Project Analysis

```javascript
const { checkTranslations } = require('angular-translation-checker');

async function analyzeMultipleProjects() {
  const projects = [
    { name: 'web-app', path: './apps/web' },
    { name: 'mobile-app', path: './apps/mobile' },
    { name: 'admin-panel', path: './apps/admin' }
  ];
  
  const results = await Promise.all(
    projects.map(async (project) => {
      const config = {
        srcPath: `${project.path}/src`,
        translationsPath: `${project.path}/src/assets/i18n`,
        project: project.name,
        languages: ['en', 'es', 'fr']
      };
      
      const analysis = await checkTranslations(config);
      return {
        project: project.name,
        ...analysis
      };
    })
  );
  
  // Aggregate results
  const totalMissing = results.reduce(
    (sum, result) => sum + result.summary.missingKeys, 0
  );
  
  console.log(`Total missing keys across all projects: ${totalMissing}`);
}
```

### Streaming Large Results

```javascript
const { checkTranslations } = require('angular-translation-checker');
const { Readable } = require('stream');

async function streamResults() {
  const results = await checkTranslations(config);
  
  // Create readable stream from unused keys
  const unusedKeysStream = new Readable({
    objectMode: true,
    read() {
      results.unusedKeys.forEach(key => this.push(key));
      this.push(null); // End stream
    }
  });
  
  // Process stream
  unusedKeysStream.on('data', (key) => {
    console.log(`Unused key: ${key}`);
  });
}
```

## Error Handling

### Error Types

```javascript
const { checkTranslations, TranslationError } = require('angular-translation-checker');

try {
  const results = await checkTranslations(config);
} catch (error) {
  if (error instanceof TranslationError) {
    switch (error.code) {
      case 'CONFIG_ERROR':
        console.error('Configuration error:', error.message);
        break;
      case 'FILE_ERROR':
        console.error('File system error:', error.message);
        break;
      case 'PARSE_ERROR':
        console.error('Translation file parse error:', error.message);
        break;
      default:
        console.error('Unknown translation error:', error.message);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Validation

```javascript
const { validateConfig, checkTranslations } = require('angular-translation-checker');

async function safeAnalysis(config) {
  // Validate configuration first
  const validation = validateConfig(config);
  if (!validation.valid) {
    console.error('Invalid configuration:', validation.errors);
    return;
  }
  
  try {
    const results = await checkTranslations(config);
    return results;
  } catch (error) {
    console.error('Analysis failed:', error.message);
    throw error;
  }
}
```

## Integration Examples

### Express.js Integration

```javascript
const express = require('express');
const { checkTranslations, formatJSON } = require('angular-translation-checker');

const app = express();

app.get('/api/translations/check', async (req, res) => {
  try {
    const config = {
      srcPath: './src',
      translationsPath: './src/assets/i18n',
      languages: ['en', 'es', 'fr'],
      outputSections: ['summary', 'missing']
    };
    
    const results = await checkTranslations(config);
    const jsonOutput = formatJSON(results, config);
    
    res.json(JSON.parse(jsonOutput));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Webpack Plugin Integration

```javascript
const { checkTranslations } = require('angular-translation-checker');

class TranslationCheckerPlugin {
  constructor(options) {
    this.options = options;
  }
  
  apply(compiler) {
    compiler.hooks.afterCompile.tapAsync(
      'TranslationCheckerPlugin',
      async (compilation, callback) => {
        try {
          const results = await checkTranslations(this.options);
          
          if (results.summary.missingKeys > 0) {
            compilation.warnings.push(
              new Error(`Found ${results.summary.missingKeys} missing translation keys`)
            );
          }
          
          callback();
        } catch (error) {
          callback(error);
        }
      }
    );
  }
}

module.exports = TranslationCheckerPlugin;
```

### Gulp Task Integration

```javascript
const gulp = require('gulp');
const { checkTranslations, formatOutput } = require('angular-translation-checker');

gulp.task('check-translations', async () => {
  const config = {
    srcPath: './src',
    translationsPath: './src/assets/i18n',
    languages: ['en', 'es', 'fr'],
    exitOnIssues: true
  };
  
  try {
    const results = await checkTranslations(config);
    const output = formatOutput(results, config);
    console.log(output);
    
    if (results.summary.missingKeys > 0) {
      throw new Error(`Found ${results.summary.missingKeys} missing keys`);
    }
  } catch (error) {
    console.error('Translation check failed:', error.message);
    process.exit(1);
  }
});
```

### Jest Test Integration

```javascript
const { checkTranslations } = require('angular-translation-checker');

describe('Translation Tests', () => {
  let translationResults;
  
  beforeAll(async () => {
    const config = {
      srcPath: './src',
      translationsPath: './src/assets/i18n',
      languages: ['en', 'es', 'fr']
    };
    
    translationResults = await checkTranslations(config);
  });
  
  test('should have no missing translations', () => {
    expect(translationResults.summary.missingKeys).toBe(0);
  });
  
  test('should have acceptable coverage', () => {
    expect(translationResults.summary.coverage).toBeGreaterThan(95);
  });
  
  test('should not have too many unused keys', () => {
    expect(translationResults.summary.unusedKeys).toBeLessThan(20);
  });
});
```

## Custom Processors

### Custom Format Processor

```javascript
const { checkTranslations } = require('angular-translation-checker');

function formatXML(results, config) {
  const { summary, missingKeys, unusedKeys } = results;
  
  return `
    <translation-report>
      <summary>
        <total-keys>${summary.totalKeys}</total-keys>
        <coverage>${summary.coverage}</coverage>
        <missing-keys>${summary.missingKeys}</missing-keys>
        <unused-keys>${summary.unusedKeys}</unused-keys>
      </summary>
      <missing-keys>
        ${Object.entries(missingKeys)
          .flatMap(([lang, keys]) => 
            keys.map(key => `<key language="${lang}">${key}</key>`)
          )
          .join('\n        ')}
      </missing-keys>
      <unused-keys>
        ${unusedKeys
          .map(key => `<key>${key}</key>`)
          .join('\n        ')}
      </unused-keys>
    </translation-report>
  `.trim();
}

// Usage
const results = await checkTranslations(config);
const xmlReport = formatXML(results, config);
console.log(xmlReport);
```

### Custom Analysis Filter

```javascript
const { checkTranslations } = require('angular-translation-checker');

async function analyzeWithCustomFilter(config) {
  const results = await checkTranslations(config);
  
  // Filter out system keys from missing analysis
  const systemKeyPattern = /^(system|internal|debug)\./;
  
  const filteredMissingKeys = {};
  for (const [lang, keys] of Object.entries(results.missingKeys)) {
    filteredMissingKeys[lang] = keys.filter(key => !systemKeyPattern.test(key));
  }
  
  // Recalculate summary
  const totalFilteredMissing = Object.values(filteredMissingKeys)
    .reduce((sum, keys) => sum + keys.length, 0);
  
  return {
    ...results,
    missingKeys: filteredMissingKeys,
    summary: {
      ...results.summary,
      missingKeys: totalFilteredMissing
    }
  };
}
```

## Performance Optimization

### Parallel Processing

```javascript
const { checkTranslations } = require('angular-translation-checker');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Master process
  const projects = ['web', 'mobile', 'admin', 'api'];
  const results = [];
  
  for (let i = 0; i < Math.min(numCPUs, projects.length); i++) {
    const worker = cluster.fork();
    worker.send({ project: projects[i] });
    
    worker.on('message', (result) => {
      results.push(result);
      if (results.length === projects.length) {
        console.log('All analyses complete:', results);
        process.exit(0);
      }
    });
  }
} else {
  // Worker process
  process.on('message', async ({ project }) => {
    const config = {
      srcPath: `./apps/${project}/src`,
      translationsPath: `./apps/${project}/src/assets/i18n`,
      project,
      languages: ['en', 'es', 'fr']
    };
    
    const results = await checkTranslations(config);
    process.send({ project, results });
  });
}
```

### Caching Results

```javascript
const { checkTranslations } = require('angular-translation-checker');
const fs = require('fs');
const crypto = require('crypto');

class TranslationAnalyzer {
  constructor(cacheDir = './.translation-cache') {
    this.cacheDir = cacheDir;
    this.ensureCacheDir();
  }
  
  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }
  
  getCacheKey(config) {
    const configStr = JSON.stringify(config, Object.keys(config).sort());
    return crypto.createHash('md5').update(configStr).digest('hex');
  }
  
  async analyzeWithCache(config) {
    const cacheKey = this.getCacheKey(config);
    const cachePath = `${this.cacheDir}/${cacheKey}.json`;
    
    // Check cache
    if (fs.existsSync(cachePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      const sourceModTime = this.getSourceModTime(config.srcPath);
      
      if (cacheData.timestamp > sourceModTime) {
        console.log('Using cached results');
        return cacheData.results;
      }
    }
    
    // Perform analysis
    console.log('Analyzing translations...');
    const results = await checkTranslations(config);
    
    // Cache results
    const cacheData = {
      timestamp: Date.now(),
      results
    };
    fs.writeFileSync(cachePath, JSON.stringify(cacheData));
    
    return results;
  }
  
  getSourceModTime(srcPath) {
    const stats = fs.statSync(srcPath);
    return stats.mtime.getTime();
  }
}

// Usage
const analyzer = new TranslationAnalyzer();
const results = await analyzer.analyzeWithCache(config);
```

## TypeScript Support

### Type Definitions

```typescript
import { 
  checkTranslations, 
  formatOutput, 
  formatJSON, 
  formatCSV,
  Config,
  AnalysisResults,
  OutputSection
} from 'angular-translation-checker';

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
  verbose?: boolean;
  quiet?: boolean;
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

interface AnalysisResults {
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
  dynamicPatterns: DynamicPattern[];
  ignoredKeys: string[];
  config: Config;
}

interface DynamicPattern {
  pattern: string;
  locations: string[];
  confidence: number;
  possibleKeys?: string[];
}

// Usage
const config: Config = {
  srcPath: './src',
  translationsPath: './src/assets/i18n',
  defaultLanguage: 'en',
  languages: ['en', 'es', 'fr']
};

const results: AnalysisResults = await checkTranslations(config);
const output: string = formatOutput(results, config);
```

### TypeScript Example

```typescript
import { checkTranslations, Config, AnalysisResults } from 'angular-translation-checker';

class TranslationService {
  private config: Config;
  
  constructor(config: Config) {
    this.config = config;
  }
  
  async analyze(): Promise<AnalysisResults> {
    try {
      return await checkTranslations(this.config);
    } catch (error) {
      console.error('Translation analysis failed:', error);
      throw error;
    }
  }
  
  async getCoverage(): Promise<number> {
    const results = await this.analyze();
    return results.summary.coverage;
  }
  
  async getMissingKeys(language?: string): Promise<string[]> {
    const results = await this.analyze();
    
    if (language) {
      return results.missingKeys[language] || [];
    }
    
    return Object.values(results.missingKeys).flat();
  }
  
  async hasIssues(): Promise<boolean> {
    const results = await this.analyze();
    return results.summary.missingKeys > 0 || results.summary.unusedKeys > 0;
  }
}

// Usage
const translationService = new TranslationService({
  srcPath: './src',
  translationsPath: './src/assets/i18n',
  defaultLanguage: 'en',
  languages: ['en', 'es', 'fr']
});

const coverage = await translationService.getCoverage();
console.log(`Translation coverage: ${coverage}%`);
```

## Best Practices

### 1. Error Handling
Always wrap API calls in try-catch blocks and handle specific error types.

### 2. Configuration Validation
Validate configuration before running analysis to catch issues early.

### 3. Performance Optimization
Use caching and parallel processing for large projects or frequent analyses.

### 4. Resource Management
Clean up resources and avoid memory leaks in long-running processes.

### 5. Testing
Write comprehensive tests for your integration code.

The Node.js API provides powerful programmatic access to Angular Translation Checker's functionality. Use it to build custom tools, integrate with existing workflows, or create specialized analysis solutions for your project needs.

For more examples and use cases, check our [examples section](/examples/) or [CLI reference](/api/cli).
