# Angular Translation Checker

[![npm version](https://badge.fury.io/js/angular-translation-checker.svg)](https://badge.fury.io/js/angular-translation-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive tool for analyzing translation keys in Angular projects using ngx-translate. Detect unused translations, missing keys, and keep your i18n files clean and organized.

## 📖 Table of Contents

### 🚀 Getting Started
- [✨ Features](#-features)
- [🏃 Quick Start](#-quick-start)
- [🛠️ Try the Live Example](#️-try-the-live-example)
- [📋 Installation & Setup](#-installation--setup)

### 📚 Usage & Configuration
- [🎯 Usage](#-usage)
- [⚙️ Configuration](#️-configuration)
- [🚫 Ignore Keys Configuration](#-ignore-keys-configuration)
- [🔍 Detection Patterns](#-detection-patterns)

### 📊 Advanced Features
- [🎉 Latest Enhancements](#-latest-enhancements)
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

- 🔍 **Accurate Detection**: Specifically designed for Angular's `{{ 'key' | translate }}` pipe syntax
- ⚡ **Dynamic Pattern Support**: Detects template interpolation, string concatenation, and variable keys
- 🎯 **Multiple Patterns**: Supports pipes, services, and programmatic usage (static + dynamic)
- 🧠 **Smart Analysis**: Identifies dynamic key patterns and provides wildcard matching
- 🏢 **Enterprise Ready**: Full support for SCREAMING_SNAKE_CASE and underscore patterns
- 📦 **Constants Detection**: Automatically finds keys in enums, object literals, and class properties
- 🔧 **Function Call Support**: Handles complex dynamic patterns with function calls
- 📁 **Auto-Detection**: Automatically finds common Angular translation folder structures
- 📊 **Multiple Formats**: Console, JSON, and CSV output options
- 🚀 **CI/CD Ready**: Exit codes and automated reporting for pipelines
- ⚙️ **Configurable**: Flexible configuration options for any project structure
- 🔧 **Zero Dependencies**: Lightweight with no external dependencies
- ✈️ **Live Example**: Complete FlightFinder demo app showcasing real-world usage patterns

## 🚀 Quick Start

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
    "i18n:check-ci": "ng-i18n-check --exit-on-issues",
    "i18n:report": "ng-i18n-check --format json > i18n-report.json"
  }
}
```

## 🎯 Usage

### Command Line Interface

```bash
ng-i18n-check [options] [command]
```

### Commands

| Command | Description |
|---------|-------------|
| `analyze` | Analyze translations (default) |
| `--init` | Generate configuration file |
| `--version` | Show version |
| `--help` | Show help |

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-l, --locales-path <path>` | Path to translation files | Auto-detected |
| `-s, --src-path <path>` | Path to source files | `./src` |
| `-f, --format <format>` | Output format (console, json, csv) | `console` |
| `-c, --config <path>` | Config file path | `./i18n-checker.config.json` |
| `--exit-on-issues` | Exit with error code if issues found | `false` |
| `-v, --verbose` | Verbose output | `false` |

### Examples

```bash
# Basic analysis with auto-detection
ng-i18n-check

# Generate configuration file
ng-i18n-check --init

# Custom translation path
ng-i18n-check --locales-path ./assets/i18n

# JSON output for reporting
ng-i18n-check --format json > translation-report.json

# CI/CD integration
ng-i18n-check --exit-on-issues

# Verbose mode for debugging
ng-i18n-check --verbose
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

Generate a configuration file:

```bash
ng-i18n-check --init
```

This creates `i18n-checker.config.json`:

```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "keysExtensions": [".ts", ".html"],
  "excludeDirs": ["node_modules", "dist", ".git", ".angular", "coverage"],
  "outputFormat": "console",
  "exitOnIssues": false,
  "verbose": false,
  "ignoreKeys": [],
  "ignorePatterns": [],
  "ignoreRegex": [],
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

## �📊 Output Formats

### Console Output (Default)

```
🔍 Analyzing translations...

📊 Translation Analysis Results:
   Total translation keys: 92
   Used keys (static): 27
   Used keys (dynamic patterns): 25
   Unused keys: 53
   Missing keys: 8

🚨 Unused translation keys:
   - menu.settings
   - buttons.advanced
   - footer.copyright

✅ All translations are properly analyzed!
```

### JSON Output

```bash
ng-i18n-check --format json
```

```json
{
  "totalKeys": 92,
  "usedKeysCount": 52,
  "unusedKeys": ["menu.settings", "buttons.advanced"],
  "missingKeys": ["common.new.feature"],
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
