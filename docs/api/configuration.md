# Configuration Options

This comprehensive reference covers all configuration options available in Angular Translation Checker. Configuration can be provided through JSON files, command-line options, or environment variables.

## Configuration File Structure

### Basic Configuration

```json
{
  "srcPath": "./src",
  "translationsPath": "./src/assets/i18n",
  "defaultLanguage": "en",
  "project": "my-app",
  "languages": ["en", "es", "fr"],
  "outputSections": ["summary", "missing", "unused"]
}
```

### Complete Configuration

```json
{
  "srcPath": "./src",
  "translationsPath": "./src/assets/i18n",
  "defaultLanguage": "en",
  "project": "enterprise-app",
  "languages": ["en", "es", "fr", "de", "ja", "zh"],
  "keySeparator": ".",
  "outputSections": ["summary", "missing", "unused", "dynamicPatterns"],
  "format": "console",
  "exitOnIssues": false,
  "ignoreKeys": ["debug.*", "test.*", "temp.*"],
  "ignoreDynamicKeys": false,
  "maxUnused": 50,
  "maxMissing": 0,
  "patterns": {
    "typescript": ["**/*.ts", "!**/*.spec.ts"],
    "html": ["**/*.html", "!**/*.spec.html"],
    "javascript": ["**/*.js", "!**/*.spec.js"]
  },
  "verbose": false,
  "quiet": false
}
```

## Core Options

### Path Configuration

#### `srcPath`
- **Type**: `string`
- **Default**: `"./src"`
- **Description**: Path to the source code directory
- **CLI**: `--src-path`

```json
{
  "srcPath": "./apps/web/src"
}
```

#### `translationsPath`
- **Type**: `string`  
- **Default**: `"./src/assets/i18n"`
- **Description**: Path to translation files directory
- **CLI**: `--translations-path`

```json
{
  "translationsPath": "./src/assets/locales"
}
```

#### `defaultLanguage`
- **Type**: `string`
- **Default**: `"en"`  
- **Description**: Default/primary language code
- **CLI**: `--default-language`

```json
{
  "defaultLanguage": "en"
}
```

#### `languages`
- **Type**: `string[]`
- **Default**: `["en"]`
- **Description**: List of supported language codes
- **CLI**: `--languages`

```json
{
  "languages": ["en", "es", "fr", "de", "ja", "zh", "ar"]
}
```

### Project Configuration

#### `project`
- **Type**: `string`
- **Default**: `"angular-app"`
- **Description**: Project name for reports and identification

```json
{
  "project": "ecommerce-frontend"
}
```

#### `keySeparator`
- **Type**: `string`
- **Default**: `"."`
- **Description**: Character used to separate nested translation keys

```json
{
  "keySeparator": "."
}
```

## Output Configuration

### `outputSections`
- **Type**: `string[]`
- **Default**: `["summary", "dynamicPatterns", "ignored", "unused", "missing"]`
- **Description**: Sections to include in output
- **CLI**: `--output`

**Available sections**:
- `summary` - Overview statistics
- `missing` - Keys used but not translated
- `unused` - Keys translated but not used
- `usedKeys` - All keys found in source code
- `translationKeys` - All keys from translation files
- `dynamicPatterns` - Dynamic key patterns detected
- `ignored` - Keys ignored by patterns
- `config` - Configuration used for analysis

```json
{
  "outputSections": ["summary", "missing", "unused"]
}
```

### `format`
- **Type**: `string`
- **Default**: `"console"`
- **Options**: `"console"`, `"json"`, `"csv"`
- **Description**: Output format
- **CLI**: `--format`

```json
{
  "format": "json"
}
```

### `verbose`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable verbose output with detailed information
- **CLI**: `--verbose`

```json
{
  "verbose": true
}
```

### `quiet`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Suppress non-error output
- **CLI**: `--quiet`

```json
{
  "quiet": true
}
```

## Validation Options

### `exitOnIssues`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Exit with error code if issues are found
- **CLI**: `--exit-on-issues`

```json
{
  "exitOnIssues": true
}
```

### `maxUnused`
- **Type**: `number`
- **Default**: `undefined`
- **Description**: Maximum allowed unused keys before failing
- **CLI**: `--max-unused`

```json
{
  "maxUnused": 10
}
```

### `maxMissing`
- **Type**: `number`
- **Default**: `undefined`
- **Description**: Maximum allowed missing keys before failing
- **CLI**: `--max-missing`

```json
{
  "maxMissing": 0
}
```

## Filtering Options

### `ignoreKeys`
- **Type**: `string[]`
- **Default**: `[]`
- **Description**: Translation keys to ignore (supports wildcards)
- **CLI**: `--ignore-keys`

```json
{
  "ignoreKeys": [
    "debug.*",
    "test.*",
    "*.temp",
    "errors.old.*",
    "experimental.*"
  ]
}
```

**Wildcard patterns**:
- `*` - Matches any characters within a segment
- `debug.*` - Matches `debug.log`, `debug.info`, etc.
- `*.temp` - Matches `data.temp`, `cache.temp`, etc.
- `test.*.*` - Matches `test.unit.spec`, `test.e2e.config`, etc.

### `ignoreDynamicKeys`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Ignore all dynamically generated key patterns
- **CLI**: `--ignore-dynamic`

```json
{
  "ignoreDynamicKeys": true
}
```

## Pattern Configuration

### `patterns`
- **Type**: `object`
- **Description**: File patterns for different file types

```json
{
  "patterns": {
    "typescript": [
      "**/*.ts",
      "**/*.tsx",
      "!**/*.spec.ts",
      "!**/*.test.ts",
      "!**/node_modules/**"
    ],
    "html": [
      "**/*.html",
      "**/*.component.html",
      "!**/*.spec.html"
    ],
    "javascript": [
      "**/*.js",
      "**/*.jsx",
      "!**/*.spec.js",
      "!**/*.test.js"
    ]
  }
}
```

**Pattern syntax**:
- `**/*` - Recursive directory matching
- `*.ext` - Files with specific extension
- `!pattern` - Exclude pattern
- `{a,b,c}` - Alternatives
- `[abc]` - Character class

## Advanced Configuration

### Dynamic Pattern Detection

```json
{
  "dynamicPatternSensitivity": "medium",
  "dynamicPatternThreshold": 0.7,
  "detectDynamicPatterns": true
}
```

#### `dynamicPatternSensitivity`
- **Type**: `string`
- **Default**: `"medium"`
- **Options**: `"low"`, `"medium"`, `"high"`
- **Description**: Sensitivity level for dynamic pattern detection

#### `dynamicPatternThreshold`
- **Type**: `number`
- **Default**: `0.7`
- **Range**: `0.0` - `1.0`
- **Description**: Confidence threshold for pattern detection

#### `detectDynamicPatterns`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable/disable dynamic pattern detection

### Performance Options

```json
{
  "maxFileSize": 1048576,
  "parallelProcessing": true,
  "cacheResults": true
}
```

#### `maxFileSize`
- **Type**: `number`
- **Default**: `1048576` (1MB)
- **Description**: Maximum file size to process (in bytes)

#### `parallelProcessing`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable parallel file processing

#### `cacheResults`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Cache analysis results between runs

## Environment-Specific Configuration

### Multiple Environments

```json
{
  "environments": {
    "development": {
      "exitOnIssues": false,
      "maxMissing": 10,
      "outputSections": ["summary", "missing"]
    },
    "staging": {
      "exitOnIssues": true,
      "maxMissing": 5,
      "outputSections": ["summary", "missing", "unused"]
    },
    "production": {
      "exitOnIssues": true,
      "maxMissing": 0,
      "maxUnused": 20,
      "outputSections": ["missing"]
    }
  }
}
```

### Configuration Inheritance

```json
{
  "extends": "./base.config.json",
  "exitOnIssues": true,
  "outputSections": ["missing"]
}
```

## Validation Rules

### Built-in Validators

```json
{
  "validators": {
    "keyFormat": {
      "enabled": true,
      "pattern": "^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)*$"
    },
    "duplicateKeys": {
      "enabled": true,
      "caseSensitive": true
    },
    "emptyValues": {
      "enabled": true,
      "allowEmpty": false
    }
  }
}
```

### Custom Validation Rules

```json
{
  "customValidators": [
    {
      "name": "noSpecialChars",
      "pattern": "^[a-zA-Z0-9._-]+$",
      "message": "Keys should only contain letters, numbers, dots, underscores, and hyphens"
    }
  ]
}
```

## Integration Options

### CI/CD Configuration

```json
{
  "ci": {
    "enabled": true,
    "failFast": true,
    "generateReports": true,
    "reportPath": "./reports/translations"
  }
}
```

### Webhook Configuration

```json
{
  "webhooks": {
    "onComplete": {
      "url": "https://api.example.com/translation-webhook",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ${WEBHOOK_TOKEN}"
      }
    }
  }
}
```

## Command Line Override Priority

Configuration sources are processed in this order (highest to lowest priority):

1. **Command Line Options** - Direct CLI flags
2. **Environment Variables** - `NG_I18N_*` variables  
3. **Configuration File** - Specified with `--config`
4. **Default Configuration** - Built-in defaults

### Environment Variables

```bash
export NG_I18N_CONFIG="./production.config.json"
export NG_I18N_FORMAT="json"
export NG_I18N_OUTPUT="summary,missing"
export NG_I18N_EXIT_ON_ISSUES="true"
```

## Configuration Validation

### Schema Validation

The configuration file is validated against a JSON schema. Invalid configurations will produce helpful error messages:

```bash
ng-i18n-check --config invalid.json
# Error: Configuration validation failed:
#   - languages: must be an array
#   - maxMissing: must be a number
```

### Configuration Testing

```bash
# Validate configuration without running analysis
ng-i18n-check --config test.json --validate-only

# Show resolved configuration
ng-i18n-check --config test.json --output config --dry-run
```

## Migration Guide

### From v1.2.x to v1.3.x

**Old format**:
```json
{
  "showSummary": true,
  "showMissing": true,
  "showUnused": false,
  "showDynamicPatterns": true
}
```

**New format**:
```json
{
  "outputSections": ["summary", "missing", "dynamicPatterns"]
}
```

### Migration Script

```bash
# Automatic migration
ng-i18n-check --migrate-config old-config.json > new-config.json
```

## Best Practices

### 1. Environment Separation
```json
{
  "development": { "maxMissing": 10 },
  "production": { "maxMissing": 0 }
}
```

### 2. Modular Configuration
```json
{
  "extends": "./base.config.json",
  "ignoreKeys": ["debug.*"]
}
```

### 3. Team Standards
```json
{
  "_documentation": "Team translation standards",
  "keyFormat": "camelCase with dots",
  "maxNestingLevel": 3,
  "requiredSections": ["summary", "missing"]
}
```

### 4. Version Control
- Keep configuration files in version control
- Use different configs for different environments
- Document configuration changes in commit messages

### 5. Documentation
```json
{
  "_metadata": {
    "version": "1.3.5",
    "author": "team@example.com",
    "lastUpdated": "2025-01-24",
    "description": "Production translation validation"
  }
}
```

## Troubleshooting

### Common Configuration Issues

1. **Invalid JSON**: Use a JSON validator
2. **Path Issues**: Use absolute paths or verify relative paths
3. **Permission Errors**: Check file/directory permissions
4. **Pattern Conflicts**: Test patterns with simple cases first

### Debug Configuration

```bash
# Show resolved configuration
ng-i18n-check --output config

# Validate configuration
ng-i18n-check --config test.json --validate-only

# Verbose configuration loading
ng-i18n-check --config test.json --verbose --dry-run
```

## Example Configurations

### Minimal Setup
```json
{
  "languages": ["en", "es"],
  "outputSections": ["summary", "missing"]
}
```

### Enterprise Setup
```json
{
  "srcPath": "./src",
  "translationsPath": "./src/assets/i18n",
  "defaultLanguage": "en",
  "languages": ["en", "es", "fr", "de", "ja", "zh"],
  "project": "enterprise-app",
  "outputSections": ["summary", "missing", "unused"],
  "exitOnIssues": true,
  "maxMissing": 0,
  "maxUnused": 20,
  "ignoreKeys": ["debug.*", "test.*", "temp.*"],
  "format": "json",
  "verbose": false
}
```

### CI/CD Optimized
```json
{
  "outputSections": ["missing"],
  "format": "json",
  "exitOnIssues": true,
  "maxMissing": 0,
  "quiet": true,
  "ignoreKeys": ["debug.*", "test.*", "dev.*"]
}
```

This comprehensive configuration reference should help you customize Angular Translation Checker for your specific needs. For more examples and use cases, check our [examples section](/examples/) or [troubleshooting guide](/guide/troubleshooting).
