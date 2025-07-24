# Configuration

Angular Translation Checker offers extensive configuration options to adapt to your project's specific needs. You can configure the tool through configuration files, command-line options, or a combination of both.

## Configuration File

Create a configuration file to define your project settings:

### Basic Configuration
```json
{
  "srcPath": "./src",
  "translationsPath": "./src/assets/i18n",
  "defaultLanguage": "en",
  "project": "my-angular-app",
  "languages": ["en", "es", "fr", "de"],
  "keySeparator": ".",
  "patterns": {
    "typescript": ["*.ts"],
    "html": ["*.html"],
    "javascript": ["*.js"]
  }
}
```

### Advanced Configuration
```json
{
  "srcPath": "./src",
  "translationsPath": "./src/assets/i18n",
  "defaultLanguage": "en",
  "project": "enterprise-app",
  "languages": ["en", "es", "fr", "de", "ja", "zh"],
  "keySeparator": ".",
  "patterns": {
    "typescript": ["*.ts", "*.tsx"],
    "html": ["*.html", "*.component.html"],
    "javascript": ["*.js", "*.jsx"]
  },
  "ignoreKeys": [
    "common.errors.*",
    "debug.*",
    "test.*"
  ],
  "ignoreDynamicKeys": true,
  "outputSections": ["summary", "missing", "unused"],
  "exitOnIssues": false,
  "maxUnused": 10,
  "maxMissing": 0
}
```

## Configuration Options

### Core Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `srcPath` | string | `"./src"` | Path to source code directory |
| `translationsPath` | string | `"./src/assets/i18n"` | Path to translation files |
| `defaultLanguage` | string | `"en"` | Default language code |
| `project` | string | `"angular-app"` | Project name for reports |
| `languages` | string[] | `["en"]` | Supported language codes |
| `keySeparator` | string | `"."` | Translation key separator |

### Pattern Matching

```json
{
  "patterns": {
    "typescript": [
      "*.ts",
      "*.tsx",
      "!*.spec.ts",
      "!*.test.ts"
    ],
    "html": [
      "*.html",
      "*.component.html",
      "!*.spec.html"
    ],
    "javascript": [
      "*.js",
      "*.jsx",
      "!*.spec.js"
    ]
  }
}
```

### Output Control

```json
{
  "outputSections": [
    "summary",
    "missing",
    "unused",
    "ignored",
    "dynamicPatterns",
    "usedKeys",
    "translationKeys",
    "config"
  ],
  "format": "console",
  "exitOnIssues": false
}
```

### Filtering Options

```json
{
  "ignoreKeys": [
    "errors.*",
    "debug.*",
    "temp.*"
  ],
  "ignoreDynamicKeys": true,
  "maxUnused": 50,
  "maxMissing": 0
}
```

## Configuration Files

### Multiple Configuration Files
You can maintain different configurations for different environments:

```bash
# Development
ng-i18n-check --config dev.config.json

# Production
ng-i18n-check --config prod.config.json

# CI/CD
ng-i18n-check --config ci.config.json
```

### Configuration Inheritance
Create a base configuration and extend it:

**base.config.json**
```json
{
  "srcPath": "./src",
  "translationsPath": "./src/assets/i18n",
  "defaultLanguage": "en",
  "languages": ["en", "es", "fr"]
}
```

**prod.config.json**
```json
{
  "extends": "./base.config.json",
  "exitOnIssues": true,
  "outputSections": ["summary", "missing"],
  "maxMissing": 0
}
```

## Command Line Overrides

Command line options override configuration file settings:

```bash
# Override output sections
ng-i18n-check --config base.config.json --output missing,unused

# Override exit behavior
ng-i18n-check --config base.config.json --exit-on-issues

# Override format
ng-i18n-check --config base.config.json --format json
```

## Environment-Specific Configurations

### Development Environment
Focus on development workflow:
```json
{
  "outputSections": ["summary", "missing", "unused"],
  "exitOnIssues": false,
  "format": "console"
}
```

### CI/CD Environment
Strict validation for automated builds:
```json
{
  "outputSections": ["missing"],
  "exitOnIssues": true,
  "format": "json",
  "maxMissing": 0
}
```

### Production Monitoring
Monitor translation health:
```json
{
  "outputSections": ["summary", "unused"],
  "format": "json",
  "maxUnused": 20
}
```

## Best Practices

1. **Version Control**: Keep configuration files in version control
2. **Environment Separation**: Use different configs for dev/staging/prod
3. **Team Standards**: Establish consistent ignore patterns across team
4. **Regular Updates**: Review and update patterns as project evolves
5. **Documentation**: Document custom patterns and ignore rules

## Migration Guide

### From v1.2.x to v1.3.x
The new `outputSections` configuration replaces individual output flags:

**Before (v1.2.x)**:
```json
{
  "showSummary": true,
  "showMissing": true,
  "showUnused": false
}
```

**After (v1.3.x)**:
```json
{
  "outputSections": ["summary", "missing"]
}
```

Need help with configuration? Check out our [examples](/examples) or [troubleshooting guide](/guide/troubleshooting).
