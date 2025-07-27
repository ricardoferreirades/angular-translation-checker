# Angular Translation Checker

[![npm version](https://badge.fury.io/js/angular-translation-checker.svg)](https://badge.fury.io/js/angular-translation-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/ricardoferreirades/angular-translation-checker)

**A modern, TypeScript-first translation analysis tool** for Angular projects using ngx-translate. Built with an extensible plugin architecture, professional reporting, and enterprise-grade features for maintaining clean, organized i18n files.

## 📖 Table of Contents

### 🚀 Getting Started
- [✨ Features](#-features)
- [🆕 What's New in v1.5.0](#-whats-new-in-v150)
- [📚 Documentation](#-documentation)
- [🏃 Quick Start](#-quick-start)
- [🛠️ Try the Live Example](#️-try-the-live-example)
- [📋 Installation & Setup](#-installation--setup)

### 📚 Usage & Configuration
- [🎯 Usage](#-usage)
- [⚙️ Configuration](#️-configuration)
- [🚫 Ignore Keys Configuration](#-ignore-keys-configuration)
- [🔍 Detection Patterns](#-detection-patterns)

### 📊 Advanced Features
- [�️ Plugin Architecture](#️-plugin-architecture)
- [📊 Output Formats](#-output-formats)
- [🔄 CI/CD Integration](#-cicd-integration)
- [🏗️ Project Structure Support](#️-project-structure-support)

### 🔧 Reference & Support
- [🔧 Advanced Usage](#-advanced-usage)
- [🆚 vs. Other Tools](#-vs-other-tools)
- [🔧 Compatibility](#-compatibility)
- [🤝 Contributing](#-contributing)
- [📝 License & Support](#-license--support)

---

## ✨ Features

### 🔥 **TypeScript-First Architecture (v1.5.0)**
- 🛡️ **Full Type Safety**: Complete TypeScript implementation with strict mode
- 🔌 **Extensible Plugin System**: 5+ plugin types for custom analysis and reporting
- 🏗️ **Modern Architecture**: Event-driven design with professional logging
- � **Zero Dependencies**: Lightweight, self-contained TypeScript solution

### 🎯 **Advanced Analysis Capabilities**
- �🔍 **Accurate Detection**: Specifically designed for Angular's `{{ 'key' | translate }}` pipe syntax
- ⚡ **Dynamic Pattern Support**: Detects template interpolation, string concatenation, and variable keys
- 🎯 **Multiple Patterns**: Supports pipes, services, and programmatic usage (static + dynamic)
- 🧠 **Smart Analysis**: Identifies dynamic key patterns with wildcard matching
- 🏢 **Enterprise Ready**: Full support for SCREAMING_SNAKE_CASE and underscore patterns
- 📦 **Constants Detection**: Automatically finds keys in enums, object literals, and class properties
- 🔧 **Function Call Support**: Handles complex dynamic patterns with function calls

### � **Professional Reporting & Output**
- 🎨 **Beautiful Console Output**: Professional Unicode formatting with timestamps
- 📊 **Multiple Formats**: Console, JSON, CSV, and HTML output options
- 🎛️ **Granular Output Control**: Select specific sections (summary, unused, missing, ignored, etc.)
- � **Detailed Reports**: Comprehensive analysis with coverage metrics and recommendations
- 🔄 **CI/CD Integration**: Exit codes, JSON reports, and automated pipeline support

### ⚙️ **Configuration & Flexibility**
- 📁 **Auto-Detection**: Automatically finds common Angular translation folder structures
- ⚙️ **Flexible Configuration**: JSON-based configuration with intelligent defaults
- 🚫 **Advanced Ignore Patterns**: Regex patterns, wildcard matching, and file exclusions
- 🌐 **Multi-Language Support**: Analyze specific languages or all available translations
- 🔧 **Path Customization**: Custom source and locale paths with validation

## 🆕 What's New in v1.5.0

### 🎉 **Complete TypeScript Rewrite**
Version 1.5.0 introduces a complete TypeScript-first architecture with modern development practices:

```typescript
// Full TypeScript support with IntelliSense
import { analyzeTranslations, AnalysisConfig } from 'angular-translation-checker';

const config: AnalysisConfig = {
  localesPath: './src/assets/i18n',
  srcPath: './src',
  outputFormat: 'json'
};

const result = await analyzeTranslations(config);
```

### 🔌 **Extensible Plugin Architecture**
Build custom analysis with our plugin system:

- **Extractors**: Custom key extraction from different file types
- **Analyzers**: Advanced analysis logic and pattern matching
- **Formatters**: Custom output formatting (Console, JSON, CSV, HTML)
- **Validators**: Custom validation rules and checks
- **Reporters**: Custom reporting and integration capabilities

### 🎨 **Enhanced User Experience**
- **Professional CLI**: Beautiful help system with examples and workflows
- **Intelligent Error Handling**: Contextual error messages with actionable suggestions
- **Modern Output**: Professional console formatting with timestamps and progress indicators
- **Comprehensive Documentation**: Updated examples, API references, and migration guides

### 🚀 **Developer Experience Improvements**
- **Build System**: Modern TypeScript compilation with source maps
- **Development Scripts**: Complete npm script ecosystem for development
- **Testing Framework**: Comprehensive test suite with TypeScript tests
- **Type Definitions**: Full TypeScript definitions for IDE support

## 📚 Documentation

📖 **[Complete Documentation](https://ricardoferreirades.github.io/angular-translation-checker/)**

### 📑 Documentation Sections

- **[Getting Started Guide](https://ricardoferreirades.github.io/angular-translation-checker/guide/)** - Step-by-step setup and basic usage
- **[TypeScript API Reference](https://ricardoferreirades.github.io/angular-translation-checker/api/)** - Complete API with type definitions
- **[Configuration Guide](https://ricardoferreirades.github.io/angular-translation-checker/guide/configuration)** - Advanced configuration options
- **[Plugin Development](https://ricardoferreirades.github.io/angular-translation-checker/plugins/)** - Build custom extractors and formatters
- **[CLI Commands](https://ricardoferreirades.github.io/angular-translation-checker/guide/cli-commands)** - Comprehensive CLI reference
- **[Examples & Use Cases](https://ricardoferreirades.github.io/angular-translation-checker/examples/)** - Real-world implementation examples
- **[Migration Guide](https://ricardoferreirades.github.io/angular-translation-checker/migration/)** - Upgrade from v1.4 to v1.5

### 🔄 Migration from v1.4 to v1.5

The new TypeScript architecture maintains backward compatibility while providing enhanced features:

#### **✅ What Stays the Same**
- All CLI options work exactly the same
- Configuration file format is compatible
- Output formats remain consistent
- All existing patterns and features work

#### **🚀 What's New**
- Full TypeScript support with type safety
- Enhanced error messages with helpful suggestions
- Professional console output with better formatting
- Plugin architecture for extensibility
- Improved performance and reliability

#### **📦 Migration Steps**

1. **Update the package** (no breaking changes):
   ```bash
   npm update angular-translation-checker
   ```

2. **Optional: Regenerate config** (for new features):
   ```bash
   ng-i18n-check --generate-config
   ```

3. **Optional: Update scripts** (for enhanced features):
   ```json
   {
     "scripts": {
       "i18n:check": "ng-i18n-check -v --output summary,unused,missing"
     }
   }
   ```

That's it! Your existing setup continues to work while gaining all the new TypeScript benefits.

## �🚀 Quick Start

### Installation

```bash
# Global installation (recommended)
npm install -g angular-translation-checker

# Local installation
npm install --save-dev angular-translation-checker
```

### Basic Usage

```bash
# Auto-detect and analyze
ng-i18n-check

# Generate configuration file
ng-i18n-check --init

# Analyze with custom path
ng-i18n-check --locales-path ./src/assets/i18n

# Show only unused keys (granular output)
ng-i18n-check --output unused

# Quick summary for CI/CD
ng-i18n-check --output summary,missing
```

## 🛠️ Try the Live Example

Explore a complete Angular application demonstrating real-world translation patterns:

```bash
# Clone the repository
git clone https://github.com/ricardoferreirades/angular-translation-checker.git
cd angular-translation-checker/example

# Install dependencies
npm install

# Run the example application
npm start

# Analyze translations in the example
npm run check-translations
```

**🎯 What you'll see:**
- **FlightFinder App**: A modern flight search application like Google Flights
- **Multilingual Support**: English, Spanish, and French translations
- **Complex Patterns**: Dynamic keys, enterprise naming conventions, and advanced usage
- **Real Results**: See exactly how the tool detects 27+ static keys and 4+ dynamic patterns

Visit: http://localhost:4200 to explore the live demo!

[⬆️ Back to Table of Contents](#-table-of-contents)

## 📋 Installation & Setup

### Global Installation (Recommended)

```bash
npm install -g angular-translation-checker
```

After global installation, you can use `ng-i18n-check` from anywhere:

```bash
cd /path/to/your/angular/project
ng-i18n-check
```

### Local Installation

```bash
npm install --save-dev angular-translation-checker
```

Add to your `package.json` scripts:

```json
{
  "scripts": {
    "i18n:check": "ng-i18n-check",
    "i18n:check-detailed": "ng-i18n-check -v --output summary,unused,missing",
    "i18n:check-ci": "ng-i18n-check --exit-on-issues --format json",
    "i18n:report": "ng-i18n-check --format json --output summary,unused,missing > i18n-report.json",
    "i18n:report-html": "ng-i18n-check --format html > reports/i18n-analysis.html",
    "i18n:config": "ng-i18n-check --generate-config"
  }
}
```

### 🎯 Script Usage Examples

```bash
# Run basic check
npm run i18n:check

# Generate detailed analysis with verbose output
npm run i18n:check-detailed

# CI/CD integration (fails build if issues found)
npm run i18n:check-ci

# Generate JSON report
npm run i18n:report

# Generate HTML report for team review
npm run i18n:report-html

# Initialize configuration
npm run i18n:config
```

## 🎯 Usage

### Command Line Interface

```bash
ng-i18n-check [options]
```

The TypeScript-first CLI provides a professional, user-friendly experience with comprehensive help and intelligent error handling.

### 📋 Core Options

| Option | Description | Default |
|--------|-------------|---------|
| `-l, --locales-path <path>` | Path to translation files directory | `./src/assets/i18n` |
| `-s, --src-path <path>` | Path to source code directory | `./src` |
| `-f, --format <format>` | Output format: `console`, `json`, `csv` | `console` |
| `-o, --output <sections>` | Output sections (comma-separated) | All sections |
| `-c, --config <path>` | Configuration file path | `./.ng-i18n-check.json` |
| `--ignore-keys <patterns>` | Ignore key patterns (comma-separated regex) | - |
| `--languages <langs>` | Specific languages to check (e.g., `en,es,fr`) | All languages |
| `--exit-on-issues` | Exit with error code if translation issues found | `false` |
| `-v, --verbose` | Enable verbose logging and detailed output | `false` |
| `--generate-config` | Generate a default configuration file | - |
| `--help, -h` | Show comprehensive help with examples | - |
| `--version` | Show version information and features | - |

### 🎛️ Output Sections

Control exactly what information you want to see:

| Section | Description |
|---------|-------------|
| `summary` | Analysis summary with counts and coverage |
| `dynamicPatterns` | Dynamic key patterns detected |
| `ignored` | Keys ignored by configuration |
| `unused` | Translation keys not used in source code |
| `missing` | Keys used in source but missing from translations |
| `usedKeys` | All keys found in source code |
| `translationKeys` | All available translation keys |
| `config` | Current configuration settings |

### 💡 Usage Examples

```bash
# Basic analysis with default settings
ng-i18n-check

# Analyze specific paths with verbose output
ng-i18n-check -l ./assets/i18n -s ./src -v

# Show only critical information
ng-i18n-check --output summary,unused,missing

# Generate JSON report and save to file
ng-i18n-check --format json --output summary,unused > translation-report.json

# Check only specific languages with custom config
ng-i18n-check --languages en,es --config ./my-i18n-config.json

# CI/CD: Exit with error if issues found
ng-i18n-check --exit-on-issues --output summary

# Generate configuration file for your project
ng-i18n-check --generate-config

# Ignore specific key patterns (useful for dynamic keys)
ng-i18n-check --ignore-keys "DYNAMIC_.*,TEST_.*"
```

### 🔄 Common Workflows

```bash
# 1. First time setup
ng-i18n-check --generate-config

# 2. Regular analysis
ng-i18n-check

# 3. Detailed inspection
ng-i18n-check -v --output summary,unused,missing

# 4. CI/CD integration
ng-i18n-check --exit-on-issues --format json
```

[⬆️ Back to Table of Contents](#-table-of-contents)

## 🏗️ Plugin Architecture

### 🔌 Extensible Design

Version 1.5.0 introduces a powerful plugin system that allows for custom analysis, formatting, and reporting:

```typescript
import { 
  ExtractorPlugin, 
  AnalyzerPlugin, 
  FormatterPlugin,
  PluginContext 
} from 'angular-translation-checker';

// Custom extractor for special file types
class CustomExtractor implements ExtractorPlugin {
  readonly name = 'custom-extractor';
  readonly version = '1.0.0';
  readonly supportedExtensions = ['.vue', '.svelte'];
  
  async extractKeys(filePath: string, content: string) {
    // Custom extraction logic
    return translationKeys;
  }
}
```

### 🧩 Built-in Plugins

The tool comes with professional-grade plugins out of the box:

#### **Extractors**
- **TypeScript Extractor**: Handles `.ts` files with advanced pattern matching
- **HTML Extractor**: Processes `.html` templates with Angular pipe syntax

#### **Analyzers**
- **Core Analyzer**: Main analysis engine with pattern detection and validation

#### **Formatters**
- **Console Formatter**: Professional terminal output with Unicode formatting
- **JSON Formatter**: Structured JSON reports with metadata
- **HTML Formatter**: Rich HTML reports with interactive features

#### **Reporters**
- **File Reporter**: Automated file output with customizable naming

### 🎯 Plugin Types

| Plugin Type | Purpose | Interface |
|-------------|---------|-----------|
| **Extractor** | Extract translation keys from files | `ExtractorPlugin` |
| **Analyzer** | Analyze extracted data and detect patterns | `AnalyzerPlugin` |
| **Formatter** | Format analysis results for output | `FormatterPlugin` |
| **Validator** | Custom validation rules and checks | `ValidatorPlugin` |
| **Reporter** | Handle result reporting and integration | `ReporterPlugin` |

### 🔧 Plugin Development

Create custom plugins to extend functionality:

```typescript
// Custom formatter example
export class MarkdownFormatter implements FormatterPlugin {
  readonly name = 'markdown-formatter';
  readonly outputFormat = 'markdown' as const;
  
  async format(result: AnalysisResult, sections: OutputSection[]) {
    return `# Translation Analysis\n\n${this.formatSummary(result)}`;
  }
}
```

[⬆️ Back to Table of Contents](#-table-of-contents)

## ⚙️ Configuration

### Auto-Detection

The tool automatically detects common Angular translation structures:

- `./src/assets/i18n`
- `./src/assets/locales`
- `./public/i18n`
- `./assets/i18n`
- `./i18n`
- `./locales`

### Configuration File

Generate a configuration file using the new TypeScript CLI:

```bash
ng-i18n-check --generate-config
```

This creates `angular-translation-checker.config.json` with intelligent defaults:

```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "outputFormat": "console",
  "outputSections": ["summary", "unused", "missing"],
  "patterns": {
    "typescript": [
      "\\b(?:translate\\.get|translate\\.instant|translate\\.stream)\\s*\\(\\s*['\"]([^'\"]+)['\"]",
      "\\b(?:translate)\\s*:\\s*['\"]([^'\"]+)['\"]",
      "\\[\\s*['\"]([^'\"]+)['\"]\\s*\\]\\s*\\|\\s*translate"
    ],
    "html": [
      "{{\\s*['\"]([^'\"]+)['\"]\\s*\\|\\s*translate",
      "\\[translate\\]\\s*=\\s*['\"]([^'\"]+)['\"]",
      "translate=['\"]([^'\"]+)['\"]"
    ]
  },
  "ignoreKeys": [],
  "ignoreFiles": ["**/node_modules/**", "**/dist/**"],
  "languages": [],
  "exitOnIssues": false,
  "verbose": false
}
```
  "ignoreFiles": []
}
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `localesPath` | string | Path to translation JSON files |
| `srcPath` | string | Path to source code files |
| `keysExtensions` | string[] | File extensions to analyze |
| `excludeDirs` | string[] | Directories to exclude from analysis |
| `outputFormat` | string | Output format: 'console', 'json', 'csv' |
| `exitOnIssues` | boolean | Exit with error code if issues found |
| `verbose` | boolean | Enable verbose logging |
| `ignoreKeys` | string[] | Exact translation keys to ignore |
| `ignorePatterns` | string[] | Wildcard patterns to ignore (*, **) |
| `ignoreRegex` | string[] | Regular expression patterns to ignore |
| `ignoreFiles` | string[] | Translation files to ignore completely |

## 🚫 Ignore Keys Configuration

### Why Use Ignore Keys?

Ignore keys help you focus on actual translation issues by excluding:
- Debug/development keys
- Deprecated translations (kept for backward compatibility)
- Temporary/experimental features
- Third-party library keys
- Dynamic keys that can't be statically analyzed

### Configuration Examples

#### Basic Ignore Configuration
```json
{
  "ignoreKeys": [
    "debug.console.log",
    "test.mock.user",
    "temp.new_feature"
  ],
  "ignorePatterns": [
    "debug.**",
    "temp.*",
    "*.deprecated"
  ],
  "ignoreRegex": [
    "^[A-Z_]+$"
  ]
}
```

#### Advanced Ignore Patterns

**Wildcard Patterns:**
- `*` matches within a segment (no dots)
- `**` matches across segments (including dots)

```json
{
  "ignorePatterns": [
    "debug.*",           // matches: debug.api, debug.logs
    "debug.**",          // matches: debug.api.request, debug.logs.error
    "*.test",            // matches: user.test, admin.test
    "internal.**.*"      // matches: internal.dev.tools, internal.system.logs
  ]
}
```

**Regular Expressions:**
```json
{
  "ignoreRegex": [
    "^temp\\.",          // Keys starting with 'temp.'
    "\\.test$",          // Keys ending with '.test'
    "^[A-Z_]+$"          // All caps constants like 'API_KEY'
  ]
}
```

### Command Line Usage

```bash
# Ignore specific keys
ng-i18n-check --ignore-keys "debug.api,temp.test"

# Ignore patterns
ng-i18n-check --ignore-patterns "debug.**,*.deprecated"

# Ignore files
ng-i18n-check --ignore-files "debug-translations.json"

# Combine multiple ignore options
ng-i18n-check --ignore-keys "temp.feature" --ignore-patterns "debug.**"
```

### Real-World Example

```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "ignoreKeys": [
    "debug.console.log",
    "test.mock.user"
  ],
  "ignorePatterns": [
    "debug.**",
    "temp.*",
    "admin.deprecated.**",
    "internal.**"
  ],
  "ignoreRegex": [
    "^[A-Z_]+$"
  ],
  "ignoreFiles": [
    "debug-translations.json",
    "test-translations.json"
  ]
}
```

This configuration would ignore:
- Exact keys: `debug.console.log`, `test.mock.user`
- All debug keys: `debug.api.request`, `debug.performance.timing`
- Temporary keys: `temp.new_feature`, `temp.experiment`
- Deprecated admin keys: `admin.deprecated.old_panel`
- Internal keys: `internal.dev.tools`, `internal.system.logs`
- Constants: `API_KEY`, `DEBUG_MODE`
- Entire files: `debug-translations.json`, `test-translations.json`

[⬆️ Back to Table of Contents](#-table-of-contents)

## 🔍 Detection Patterns

The tool detects these translation usage patterns:

### Static Template Pipe Usage
```html
<!-- Single quotes -->
{{ 'welcome.message' | translate }}

<!-- Double quotes -->
{{ "menu.home" | translate }}

<!-- Static template literals -->
{{ `buttons.save` | translate }}
```

### Dynamic Template Pipe Usage
```html
<!-- Template interpolation -->
{{ `user.${userType}.name` | translate }}
{{ `errors.${errorCode}.message` | translate }}

<!-- Underscore patterns with function calls -->
{{ `ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(key)}` | translate }}
{{ `API_ENDPOINTS.${action.toUpperCase()}` | translate }}
{{ `ERROR_MESSAGES.${errorType}` | translate }}

<!-- String concatenation -->
{{ 'messages.' + messageType | translate }}
{{ 'permissions.' + userRole + '.description' | translate }}

<!-- Conditional keys -->
{{ (isAdmin ? 'admin.panel' : 'user.panel') | translate }}
{{ condition && 'optional.message' | translate }}

<!-- Variable keys -->
{{ dynamicKey | translate }}
{{ getTranslationKey() | translate }}
```

### Static Programmatic Usage
```typescript
// TranslateService methods
this.translate.get('error.message')
this.translate.instant('success.saved')

// Custom service methods
this.translateService.get('custom.key')
this.translationService.translate('another.key')
```

### Dynamic Programmatic Usage
```typescript
// Template literal interpolation
this.translate.get(`user.${this.userType}.profile`)
this.translate.instant(`notifications.${type}.title`)

// Underscore patterns with function calls
this.translate.get(`ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(key)}`)
this.translate.instant(`API_ENDPOINTS.${action.toUpperCase()}`)
this.translate.get(`USER_PROFILE.${userType.toUpperCase()}.SETTINGS`)

// String concatenation
this.translate.get('errors.' + errorCode)
this.translate.instant('messages.' + messageType + '.content')

// Variable and function calls
this.translate.get(this.dynamicKey)
this.translate.instant(this.getTranslationKey())

// Conditional translations
this.translate.get(isLoggedIn ? 'user.dashboard' : 'guest.welcome')
```

### Constants and Enums Usage
```typescript
// Object literals with translation keys
export const MESSAGES = {
  ERROR: 'error.message',
  SUCCESS: 'success.message',
  NETWORK_ERROR: 'error.network'
};

// Enum declarations
export enum ErrorMessages {
  NETWORK = 'error.network',
  VALIDATION = 'error.validation',
  GENERAL = 'error.message'
}

// Simple constants
const ERROR_KEY = 'error.message';
export const USER_PROFILE_NAME = 'user.profile.name';

// Class properties
export class TranslationConstants {
  public static readonly MESSAGES = {
    ERROR: 'error.message',
    SUCCESS: 'success.message'
  };
  
  private readonly ADMIN_DASHBOARD = 'admin.panel.dashboard';
  readonly errorMessage = 'error.message';
}

// Usage in components
this.translate.get(MESSAGES.ERROR);
this.translate.instant(ErrorMessages.NETWORK);
this.translate.get(TranslationConstants.MESSAGES.SUCCESS);
```

[⬆️ Back to Table of Contents](#-table-of-contents)

## 🎉 Latest Enhancements

### ✈️ Complete Example Application
A fully functional FlightFinder application showcasing:

```typescript
// Real-world patterns from the example app
@Component({
  selector: 'app-flight-finder',
  template: `
    <!-- Language switching with real-time updates -->
    <select (change)="switchLanguage($event)" [value]="currentLanguage">
      <option value="en">🇺🇸 English</option>
      <option value="es">🇪🇸 Español</option>
      <option value="fr">🇫🇷 Français</option>
    </select>
    
    <!-- Dynamic flight search translations -->
    <h1>{{ 'FLIGHT.SEARCH.TITLE' | translate }}</h1>
    <p>{{ 'FLIGHT.RESULTS.FOUND_FLIGHTS' | translate:{ count: flightCount } }}</p>
    
    <!-- Complex enterprise patterns -->
    <div>{{ getAccessMessage(userRole) | translate }}</div>
  `
})
export class FlightFinderComponent {
  // Dynamic pattern with enterprise naming
  getAccessMessage(role: string) {
    return `ACCESS_RIGHTS_CONFIRMATION.${role.toUpperCase()}.GRANTED`;
  }
  
  // Constants automatically detected
  readonly FLIGHT_MESSAGES = {
    BOOKING_SUCCESS: 'FLIGHT.BOOKING.BOOKING_SUCCESS',
    SEARCH_ERROR: 'FLIGHT.SEARCH.ERROR'
  };
}
```

**🎯 Example Results:**
- **Static Keys Detected**: 27+ translation keys across 3 languages
- **Dynamic Patterns**: 4+ complex patterns including enterprise naming
- **Comprehensive Analysis**: 92+ total translation keys with smart pattern matching
- **Multilingual Support**: English, Spanish, and French translations

### Enhanced Enterprise Support

### Underscore Pattern Support
The library now fully supports enterprise naming conventions with underscores:

```typescript
// Detected: SCREAMING_SNAKE_CASE patterns
{{ `ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(key)}` | translate }}
{{ `API_ENDPOINTS.${action.toUpperCase()}` | translate }}
{{ `USER_PROFILE.${userType}_SETTINGS` | translate }}

// Matches translation keys like:
// ACCESS_RIGHTS_CONFIRMATION.INFO.USER_MANAGEMENT
// ACCESS_RIGHTS_CONFIRMATION.INFO.ADMIN_PANEL
// API_ENDPOINTS.USER_CREATE
// USER_PROFILE.ADMIN_SETTINGS
```

### Constants and Enums Detection
Translation keys stored in constants, enums, and object literals are now automatically detected:

```typescript
// All these patterns are now detected
export const TRANSLATION_KEYS = {
  ERROR_MESSAGE: 'error.message',
  SUCCESS_MESSAGE: 'success.message'
};

export enum ApiMessages {
  NETWORK_ERROR = 'api.network.error',
  TIMEOUT = 'api.timeout.error'
}

const USER_SETTINGS_KEY = 'user.settings.theme';

export class Constants {
  static readonly ADMIN_PANEL = 'admin.panel.dashboard';
  private errorKey = 'error.validation';
}
```

### Real-World Impact
These enhancements solve common enterprise Angular development scenarios:

```typescript
// Enterprise component example
@Component({
  selector: 'app-access-control',
  template: `
    <!-- Dynamic patterns with underscores -->
    <div>{{ getAccessMessage(userRole) | translate }}</div>
    
    <!-- Constants usage -->
    <error-message>{{ ERRORS.NETWORK | translate }}</error-message>
  `
})
export class AccessControlComponent {
  // Constants detected automatically
  readonly ERRORS = {
    NETWORK: 'error.network.connection',
    TIMEOUT: 'error.network.timeout'
  };
  
  getAccessMessage(role: string) {
    // Dynamic pattern with function call - now detected!
    return `ACCESS_RIGHTS_CONFIRMATION.${role.toUpperCase()}.GRANTED`;
  }
}
```

**Result**: Comprehensive detection of all translation patterns in enterprise applications! 🎉

## 📊 Output Formats

### 🎨 Console Output (Default)

The new TypeScript CLI provides beautiful, professional console output:

```
┌─ Angular Translation Checker Analysis ─────────────────────────┐
│ Analysis completed at: 2025-07-27 18:12:47                │
│ Languages analyzed: en, es, fr, de                            │
└─────────────────────────────────────────────────────────────────┘

Translation Summary
--------------------
Languages: en, es, fr, de
Total translations: 156
Used keys: 89
Unused keys: 67
Missing keys: 12
Coverage: 57%

🚨 Missing Keys (12):
   • common.new.feature
   • dashboard.widgets.chart
   • navigation.admin.users

⚠️  Unused Keys (67):
   • menu.settings.old
   • buttons.advanced.deprecated
   • footer.copyright.2023
```

### 📋 JSON Output

Perfect for CI/CD integration and automated reporting:

```bash
ng-i18n-check --format json --output summary,unused
```

```json
{
  "metadata": {
    "generatedAt": "2025-07-27T18:12:47.000Z",
    "tool": "angular-translation-checker",
    "version": "1.5.0",
    "analyzedFiles": "./src",
    "localesPath": "./src/assets/i18n"
  },
  "summary": {
    "totalTranslations": 156,
    "totalUsedKeys": 89,
    "totalUnusedKeys": 67,
    "totalMissingKeys": 12,
    "coverage": 57,
    "languages": ["en", "es", "fr", "de"]
  },
  "analysis": {
    "unused": [
      "menu.settings.old",
      "buttons.advanced.deprecated",
      "footer.copyright.2023"
    ]
  }
}
```

### 📊 CSV Output

Perfect for spreadsheet analysis and data processing:

```bash
ng-i18n-check --format csv --output unused,missing
```

```csv
Type,Key,File,Line,Language,Status
unused,menu.settings.old,,,,deprecated
unused,buttons.advanced.deprecated,,,,deprecated
missing,common.new.feature,src/app/dashboard.ts,42,en,missing
missing,navigation.admin.users,src/app/admin.html,15,es,missing
```

### 🌐 HTML Output

Rich, interactive reports perfect for team reviews:

```bash
ng-i18n-check --format html > reports/translation-analysis.html
```

Generates a comprehensive HTML report with:
- **Interactive tables** with sorting and filtering
- **Visual coverage charts** and statistics
- **Syntax-highlighted code examples**
- **Responsive design** for mobile and desktop viewing
- **Export capabilities** to PDF and other formats
  "translationKeys": [...],
  "usedKeys": [...]
}
```

### CSV Output

```bash
ng-i18n-check --format csv
```

```csv
Type,Key,Status
unused,"menu.settings",unused
unused,"buttons.advanced",unused
missing,"new.feature",missing
```

[⬆️ Back to Table of Contents](#-table-of-contents)

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Translation Check
on: [push, pull_request]

jobs:
  translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx angular-translation-checker --exit-on-issues
```

### GitLab CI

```yaml
translation-check:
  stage: test
  script:
    - npm ci
    - npx angular-translation-checker --exit-on-issues
  only:
    - merge_requests
    - main
```

### Package.json Scripts

```json
{
  "scripts": {
    "i18n:check": "ng-i18n-check",
    "i18n:check-ci": "ng-i18n-check --exit-on-issues",
    "i18n:report": "ng-i18n-check --format json > reports/i18n-report.json",
    "prebuild": "npm run i18n:check-ci"
  }
}
```

[⬆️ Back to Table of Contents](#-table-of-contents)

## 🏗️ Project Structure Support

### Standard Angular CLI
```
src/
├── assets/
│   └── i18n/
│       ├── en.json
│       └── es.json
└── app/
```

### Public Folder
```
public/
└── i18n/
    ├── en.json
    └── es.json
src/
└── app/
```

### Nx Workspace
```
apps/
└── my-app/
    └── src/
        ├── assets/
        │   └── i18n/
        └── app/
```

### Monorepo
```
packages/
├── shared/
│   └── i18n/
└── app1/
    └── src/
```

[⬆️ Back to Table of Contents](#-table-of-contents)

## 🔧 Advanced Usage

### Programmatic API

```javascript
const { analyzeTranslations } = require('angular-translation-checker');

const results = analyzeTranslations({
  localesPath: './src/assets/i18n',
  srcPath: './src',
  verbose: true
});

console.log('Unused keys:', results.unusedKeys);
console.log('Missing keys:', results.missingKeys);
```

### Custom Patterns

Extend detection patterns by modifying the library or submitting a feature request.

[⬆️ Back to Table of Contents](#-table-of-contents)

## 🆚 vs. Other Tools

| Feature | angular-translation-checker | i18n-unused | Others |
|---------|----------------------------|-------------|--------|
| Angular pipe support | ✅ Perfect | ❌ No | ⚠️ Limited |
| Dynamic patterns | ✅ Advanced (underscores, functions) | ❌ No | ⚠️ Basic |
| Constants/Enums | ✅ Full Support | ❌ No | ❌ No |
| Enterprise naming | ✅ SCREAMING_SNAKE_CASE | ❌ No | ❌ No |
| Auto-detection | ✅ Yes | ❌ No | ⚠️ Basic |
| Zero config | ✅ Yes | ❌ No | ⚠️ Complex |
| Multiple outputs | ✅ Console, JSON, CSV | ⚠️ Console only | ⚠️ Limited |
| CI/CD ready | ✅ Exit codes, reports | ⚠️ Basic | ⚠️ Manual |

## 🔧 Compatibility

### ✅ **Supported Environments**

| Component | Minimum Version | Recommended | Notes |
|-----------|----------------|-------------|--------|
| **Node.js** | 14.0.0 | 20.0.0+ | LTS versions recommended |
| **Angular** | 12.0.0 | 15.0.0+ | All modern Angular versions |
| **ngx-translate** | Any | 15.0.0+ | Core translation library |
| **npm** | 6.0.0 | 8.0.0+ | Package manager |

### 🎯 **Framework Compatibility**

| Framework | Support Level | Translation Library | Status |
|-----------|---------------|-------------------|---------|
| **Angular** | ✅ Full Support | ngx-translate | Primary target |
| **React** | ❌ Not Supported | react-i18next | Use different tool |
| **Vue.js** | ❌ Not Supported | vue-i18n | Use different tool |
| **Vanilla JS** | ❌ Not Supported | i18next | Use different tool |

### 📁 **Project Structure Support**

| Structure Type | Path Pattern | Auto-Detection | Status |
|----------------|-------------|----------------|---------|
| **Angular CLI** | `src/assets/i18n/` | ✅ Yes | ✅ Full Support |
| **Public Folder** | `public/i18n/` | ✅ Yes | ✅ Full Support |
| **Nx Workspace** | `apps/*/src/assets/i18n/` | ✅ Yes | ✅ Full Support |
| **Monorepo** | `packages/*/i18n/` | ✅ Yes | ✅ Full Support |
| **Custom Paths** | Any structure | ⚙️ Manual Config | ✅ Full Support |

### 📄 **File Format Support**

| Format | Extension | Support Level | Notes |
|--------|-----------|---------------|-------|
| **JSON** | `.json` | ✅ Full Support | Primary format |
| **TypeScript** | `.ts` | ✅ Source Scanning | Component/service files |
| **HTML** | `.html` | ✅ Template Scanning | Angular templates |
| **YAML** | `.yaml`, `.yml` | ❌ Not Supported | JSON only |
| **Properties** | `.properties` | ❌ Not Supported | JSON only |
| **XML** | `.xml` | ❌ Not Supported | JSON only |

### 🔍 **Pattern Detection Support**

| Pattern Type | Example | Support Level | Version |
|-------------|---------|---------------|---------|
| **Static Pipes** | `'key' \| translate` | ✅ Full Support | 1.0.0+ |
| **Static Services** | `translate.get('key')` | ✅ Full Support | 1.0.0+ |
| **Template Interpolation** | `` `key.${var}` \| translate `` | ✅ Enhanced Support | 1.0.0+ |
| **String Concatenation** | `'prefix.' + var \| translate` | ✅ Enhanced Support | 1.0.0+ |
| **Conditional Keys** | `(cond ? 'key1' : 'key2') \| translate` | ✅ Enhanced Support | 1.0.0+ |
| **Variable Keys** | `dynamicKey \| translate` | ✅ Enhanced Support | 1.0.0+ |
| **Underscore Patterns** | `` `ACCESS_RIGHTS.${key}` \| translate `` | ✅ Full Support | 1.3.0+ |
| **Function Calls** | `` `KEY.${toUpperCase(var)}` \| translate `` | ✅ Full Support | 1.3.0+ |
| **Constants/Enums** | `const KEYS = { ERROR: 'error.msg' }` | ✅ Full Support | 1.3.0+ |
| **Object Literals** | `MESSAGES = { SUCCESS: 'success.msg' }` | ✅ Full Support | 1.3.0+ |
| **Class Properties** | `readonly key = 'translation.key'` | ✅ Full Support | 1.3.0+ |

### 🖥️ **Platform Compatibility**

| Platform | Support Level | Notes |
|----------|---------------|-------|
| **macOS** | ✅ Full Support | Native support |
| **Linux** | ✅ Full Support | All distributions |
| **Windows** | ✅ Full Support | PowerShell & CMD |
| **Docker** | ✅ Full Support | Container environments |
| **CI/CD** | ✅ Full Support | GitHub Actions, GitLab CI, Jenkins |

### 📦 **Installation Methods**

| Method | Command | Use Case | Support |
|--------|---------|----------|---------|
| **Global** | `npm install -g angular-translation-checker` | CLI usage across projects | ✅ Recommended |
| **Local Dev** | `npm install --save-dev angular-translation-checker` | Project-specific | ✅ Full Support |
| **npx** | `npx angular-translation-checker` | One-time usage | ✅ Full Support |
| **Yarn** | `yarn global add angular-translation-checker` | Alternative package manager | ✅ Full Support |

### ⚠️ **Limitations**

| Limitation | Description | Workaround |
|------------|-------------|------------|
| **Framework Scope** | Angular + ngx-translate only | Use framework-specific tools for React/Vue |
| **File Format** | JSON translation files only | Convert YAML/XML to JSON |
| **Complex Dynamics** | Very complex dynamic key generation | Manual review may be needed |
| **Build-time Keys** | Keys generated during build process | Use configuration to exclude patterns |

### 🚀 **Performance Characteristics**

| Metric | Typical Performance | Large Projects |
|--------|-------------------|----------------|
| **Scan Speed** | ~1000 files/second | Still fast |
| **Memory Usage** | <50MB | <200MB |
| **Translation Files** | Up to 100 languages | Tested with 50+ |
| **Project Size** | No limit | Tested with 10,000+ files |

[⬆️ Back to Table of Contents](#-table-of-contents)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

### Development Setup

```bash
git clone https://github.com/ricardoferreirades/angular-translation-checker.git
cd angular-translation-checker
npm install
npm test
```

[⬆️ Back to Table of Contents](#-table-of-contents)

## 📝 License & Support

### 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

### 🐛 Issues & Support

- **Report bugs**: [GitHub Issues](https://github.com/ricardoferreirades/angular-translation-checker/issues)
- **Questions**: [GitHub Discussions](https://github.com/ricardoferreirades/angular-translation-checker/discussions)
- **Try the Example**: [FlightFinder Demo App](https://github.com/ricardoferreirades/angular-translation-checker/tree/main/example)

### 🎯 Example Application

Explore the complete **FlightFinder** demo application in the `/example` folder:

```bash
git clone https://github.com/ricardoferreirades/angular-translation-checker.git
cd angular-translation-checker/example
npm install && npm start
```

**Features:**
- ✈️ Modern flight search interface (like Google Flights)
- 🌐 Real-time language switching (English/Spanish/French)
- 🏢 Enterprise-level translation patterns
- 🎨 Clean, professional design
- 📊 Perfect demonstration of all detection capabilities

### 🔗 Related Projects

- [ngx-translate](https://github.com/ngx-translate/core) - Angular internationalization library
- [@angular/localize](https://angular.io/guide/i18n) - Angular's official i18n solution

[⬆️ Back to Table of Contents](#-table-of-contents)

---

Made with ❤️ for the Angular community
