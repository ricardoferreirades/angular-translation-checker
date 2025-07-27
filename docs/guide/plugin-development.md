# Plugin Development Guide

## 🔌 Plugin Architecture Overview

Angular Translation Checker v1.5.0 introduces a powerful, TypeScript-first plugin system that allows you to extend functionality with custom extractors, analyzers, formatters, and reporters.

## Plugin Types

### 1. **ExtractorPlugin** - Extract Translation Keys
Extract translation keys from different file types.

```typescript
import { ExtractorPlugin, PluginContext, TranslationKey } from 'angular-translation-checker';

export class CustomExtractor implements ExtractorPlugin {
  readonly name = 'custom-extractor';
  readonly version = '1.0.0';
  readonly description = 'Extract keys from custom file format';
  readonly supportedExtensions = ['.vue', '.svelte'];

  async initialize(context: PluginContext): Promise<void> {
    context.logger.info(`Initializing ${this.name}`);
  }

  async extractKeys(filePath: string, content: string): Promise<TranslationKey[]> {
    const keys: TranslationKey[] = [];
    
    // Custom extraction logic
    const matches = content.match(/\$t\(['"]([^'"]+)['"]\)/g);
    if (matches) {
      matches.forEach(match => {
        const key = match.match(/\$t\(['"]([^'"]+)['"]\)/)?.[1];
        if (key) {
          keys.push({
            key,
            filePath,
            line: this.getLineNumber(content, match),
            type: 'static'
          });
        }
      });
    }
    
    return keys;
  }

  private getLineNumber(content: string, match: string): number {
    const lines = content.substr(0, content.indexOf(match)).split('\n');
    return lines.length;
  }
}
```

### 2. **AnalyzerPlugin** - Custom Analysis Logic
Implement custom analysis and pattern detection.

```typescript
import { AnalyzerPlugin, PluginContext, AnalysisContext, AnalysisResult } from 'angular-translation-checker';

export class CustomAnalyzer implements AnalyzerPlugin {
  readonly name = 'custom-analyzer';
  readonly version = '1.0.0';
  readonly description = 'Custom analysis with special rules';

  async initialize(context: PluginContext): Promise<void> {
    context.logger.info(`Initializing ${this.name}`);
  }

  async analyze(context: AnalysisContext): Promise<Partial<AnalysisResult>> {
    const { extractedKeys, translationFiles, config } = context;
    
    // Custom analysis logic
    const customMetrics = this.calculateCustomMetrics(extractedKeys, translationFiles);
    
    return {
      // Return partial analysis result
      customData: customMetrics
    };
  }

  private calculateCustomMetrics(keys: TranslationKey[], files: TranslationFile[]) {
    // Custom metrics calculation
    return {
      complexityScore: this.calculateComplexity(keys),
      recommendations: this.generateRecommendations(keys, files)
    };
  }
}
```

### 3. **FormatterPlugin** - Custom Output Formats
Create custom output formats for analysis results.

```typescript
import { FormatterPlugin, PluginContext, AnalysisResult, OutputSection } from 'angular-translation-checker';

export class MarkdownFormatter implements FormatterPlugin {
  readonly name = 'markdown-formatter';
  readonly version = '1.0.0';
  readonly description = 'Format output as Markdown';
  readonly outputFormat = 'markdown' as const;

  async initialize(context: PluginContext): Promise<void> {
    context.logger.info(`Initializing ${this.name}`);
  }

  async format(result: AnalysisResult, sections: OutputSection[]): Promise<string> {
    const output: string[] = [];
    
    output.push('# Translation Analysis Report');
    output.push('');
    
    if (sections.includes('summary')) {
      output.push(...this.formatSummary(result));
    }
    
    if (sections.includes('unused')) {
      output.push(...this.formatUnusedKeys(result));
    }
    
    return output.join('\n');
  }

  private formatSummary(result: AnalysisResult): string[] {
    const { summary } = result;
    return [
      '## Summary',
      '',
      `- **Total Translations**: ${summary.totalTranslations}`,
      `- **Used Keys**: ${summary.totalUsedKeys}`,
      `- **Unused Keys**: ${summary.totalUnusedKeys}`,
      `- **Missing Keys**: ${summary.totalMissingKeys}`,
      `- **Coverage**: ${summary.coverage}%`,
      ''
    ];
  }

  private formatUnusedKeys(result: AnalysisResult): string[] {
    const output = ['## Unused Keys', ''];
    
    if (result.unusedKeys.length === 0) {
      output.push('✅ No unused keys found!');
    } else {
      result.unusedKeys.forEach(key => {
        output.push(`- \`${key}\``);
      });
    }
    
    output.push('');
    return output;
  }
}
```

### 4. **ValidatorPlugin** - Custom Validation Rules
Implement custom validation logic.

```typescript
import { ValidatorPlugin, PluginContext, AnalysisResult } from 'angular-translation-checker';

export class CustomValidator implements ValidatorPlugin {
  readonly name = 'custom-validator';
  readonly version = '1.0.0';
  readonly description = 'Custom validation rules';

  async initialize(context: PluginContext): Promise<void> {
    context.logger.info(`Initializing ${this.name}`);
  }

  async validate(result: AnalysisResult): Promise<ValidationResult[]> {
    const issues: ValidationResult[] = [];
    
    // Custom validation logic
    if (result.summary.coverage < 80) {
      issues.push({
        type: 'warning',
        message: 'Translation coverage is below 80%',
        suggestion: 'Review unused keys and remove unnecessary translations'
      });
    }
    
    // Check for naming conventions
    result.translationFiles.forEach(file => {
      Object.keys(file.content).forEach(key => {
        if (!this.isValidKeyFormat(key)) {
          issues.push({
            type: 'error',
            message: `Invalid key format: ${key}`,
            file: file.path,
            suggestion: 'Use camelCase or kebab-case for translation keys'
          });
        }
      });
    });
    
    return issues;
  }

  private isValidKeyFormat(key: string): boolean {
    // Custom key format validation
    return /^[a-zA-Z][a-zA-Z0-9._-]*$/.test(key);
  }
}

interface ValidationResult {
  type: 'error' | 'warning' | 'info';
  message: string;
  file?: string;
  line?: number;
  suggestion?: string;
}
```

### 5. **ReporterPlugin** - Custom Reporting
Handle custom reporting and integration.

```typescript
import { ReporterPlugin, PluginContext, AnalysisResult } from 'angular-translation-checker';
import * as fs from 'fs/promises';

export class SlackReporter implements ReporterPlugin {
  readonly name = 'slack-reporter';
  readonly version = '1.0.0';
  readonly description = 'Send reports to Slack';

  private webhookUrl: string;

  async initialize(context: PluginContext): Promise<void> {
    this.webhookUrl = context.config.plugins?.find(p => p.name === this.name)?.options?.webhookUrl;
    if (!this.webhookUrl) {
      throw new Error('Slack webhook URL is required');
    }
    context.logger.info(`Initializing ${this.name}`);
  }

  async report(result: AnalysisResult, formattedOutput: string): Promise<void> {
    const slackMessage = this.createSlackMessage(result);
    
    try {
      await this.sendToSlack(slackMessage);
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
    }
  }

  private createSlackMessage(result: AnalysisResult) {
    const { summary } = result;
    
    return {
      text: "Translation Analysis Complete",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Translation Analysis Results*\n` +
                  `• Total: ${summary.totalTranslations}\n` +
                  `• Used: ${summary.totalUsedKeys}\n` +
                  `• Unused: ${summary.totalUnusedKeys}\n` +
                  `• Missing: ${summary.totalMissingKeys}\n` +
                  `• Coverage: ${summary.coverage}%`
          }
        }
      ]
    };
  }

  private async sendToSlack(message: any): Promise<void> {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }
  }
}
```

## Plugin Registration

### Programmatic Registration

```typescript
import { PluginManager } from 'angular-translation-checker';
import { CustomExtractor, MarkdownFormatter, SlackReporter } from './plugins';

const pluginManager = new PluginManager();

// Register plugins
await pluginManager.registerPlugin(new CustomExtractor());
await pluginManager.registerPlugin(new MarkdownFormatter());
await pluginManager.registerPlugin(new SlackReporter());

// Use in analysis
const result = await analyzeTranslations(config);
```

### Configuration-Based Registration

```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "plugins": [
    {
      "name": "custom-extractor",
      "enabled": true,
      "options": {
        "fileExtensions": [".vue", ".svelte"]
      }
    },
    {
      "name": "slack-reporter",
      "enabled": true,
      "options": {
        "webhookUrl": "https://hooks.slack.com/services/..."
      }
    }
  ]
}
```

## Plugin Development Best Practices

### 1. **Error Handling**
```typescript
async extractKeys(filePath: string, content: string): Promise<TranslationKey[]> {
  try {
    // Extraction logic
    return keys;
  } catch (error) {
    this.logger.error(`Failed to extract keys from ${filePath}:`, error);
    return []; // Return empty array instead of throwing
  }
}
```

### 2. **Logging**
```typescript
async initialize(context: PluginContext): Promise<void> {
  context.logger.debug(`Initializing ${this.name} v${this.version}`);
  context.logger.info(`Plugin ${this.name} ready`);
}
```

### 3. **Performance**
```typescript
// Use async/await for I/O operations
async extractKeys(filePath: string, content: string): Promise<TranslationKey[]> {
  // Process large files in chunks
  const chunks = this.chunkContent(content);
  const results = await Promise.all(
    chunks.map(chunk => this.processChunk(chunk))
  );
  return results.flat();
}
```

### 4. **Testing**
```typescript
// plugin.test.ts
import { CustomExtractor } from './custom-extractor';

describe('CustomExtractor', () => {
  let extractor: CustomExtractor;

  beforeEach(() => {
    extractor = new CustomExtractor();
  });

  it('should extract keys from Vue files', async () => {
    const content = `<template>{{ $t('hello.world') }}</template>`;
    const keys = await extractor.extractKeys('test.vue', content);
    
    expect(keys).toHaveLength(1);
    expect(keys[0].key).toBe('hello.world');
  });
});
```

## Publishing Plugins

### NPM Package Structure
```
my-translation-checker-plugin/
├── src/
│   ├── index.ts
│   └── extractor.ts
├── dist/
├── package.json
├── README.md
└── tsconfig.json
```

### Package.json
```json
{
  "name": "my-translation-checker-plugin",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": ["angular", "translation", "checker", "plugin"],
  "peerDependencies": {
    "angular-translation-checker": "^1.5.0"
  }
}
```

### Export Plugin
```typescript
// src/index.ts
export { CustomExtractor } from './extractor';
export { MarkdownFormatter } from './formatter';
```

## Examples & Templates

Check out the [plugin examples repository](https://github.com/ricardoferreirades/angular-translation-checker-plugins) for complete plugin templates and examples.

## Plugin API Reference

For complete type definitions and interfaces, see the [TypeScript API Reference](/api/).
