# Quick Start

Get up and running with Angular Translation Checker in minutes. This guide walks you through your first analysis and shows you the most common usage patterns.

## Your First Analysis

Navigate to your Angular project directory and run:

```bash
ng-i18n-check
```

You'll see output similar to this:

```
🔍 Analyzing translations...

📊 Translation Analysis Results:
   Total translation keys: 125
   Used keys (static): 89
   Used keys (dynamic patterns): 23
   Unused keys: 13
   Missing keys: 5

🚨 Unused translation keys:
   - BUTTONS.DEPRECATED_SAVE
   - ERRORS.OLD_VALIDATION
   - ...

⚠️  Missing translation keys:
   - COMMON.NEW_FEATURE.TITLE
   - DASHBOARD.RECENT_ACTIVITY
   - ...
```

## Understanding the Output

The default output shows several sections:

- **📊 Summary**: Overview of your translation health
- **🎯 Dynamic Patterns**: Keys matched by patterns like `COMMON.LOADING.*`
- **🚫 Ignored Keys**: Keys excluded by your configuration
- **🚨 Unused Keys**: Translations that can potentially be removed
- **⚠️ Missing Keys**: Referenced keys that need translation files

## Focus on What Matters

Use the new `--output` option to show only what you need:

### Show Only Unused Keys (Perfect for Cleanup)
```bash
ng-i18n-check --output unused
```

```
🔍 Analyzing translations...

🚨 Unused translation keys:
   - BUTTONS.DEPRECATED_SAVE
   - ERRORS.OLD_VALIDATION
   - LEGACY.FEATURE.TITLE
   - TEMP.DEBUG_MESSAGE
```

### Show Only Missing Keys (Perfect for Development)
```bash
ng-i18n-check --output missing
```

```
🔍 Analyzing translations...

⚠️  Missing translation keys:
   - COMMON.NEW_FEATURE.TITLE
   - DASHBOARD.RECENT_ACTIVITY
   - PROFILE.SETTINGS.PRIVACY
```

### Show Summary + Specific Sections
```bash
ng-i18n-check --output summary,unused,missing
```

## Common Workflows

### 🧹 **Cleanup Workflow**
Remove unused translations to keep your files lean:

```bash
# 1. Find unused keys
ng-i18n-check --output unused

# 2. Review the list and remove them from your translation files

# 3. Verify they're gone
ng-i18n-check --output summary
```

### 🐛 **Development Workflow**
Check for missing translations while developing:

```bash
# Quick health check
ng-i18n-check --output summary

# Find missing translations for new features
ng-i18n-check --output missing
```

### 🔍 **Code Review Workflow**
Generate reports for pull requests:

```bash
# Detailed console report
ng-i18n-check --verbose

# JSON report for automated processing
ng-i18n-check --format json > translation-report.json
```

### 🚀 **CI/CD Workflow**
Fail builds when translations are incomplete:

```bash
# Fail if any translations are missing
ng-i18n-check --output missing --exit-on-issues

# Fail on both unused and missing (strict mode)
ng-i18n-check --output unused,missing --exit-on-issues
```

## Working with Configuration

For more control, create a configuration file:

```bash
ng-i18n-check --generate-config
```

This creates `i18n-checker.config.json`:

```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src", 
  "keysExtensions": [".ts", ".html"],
  "outputFormat": "console",
  "exitOnIssues": false,
  "verbose": false
}
```

You can now customize paths, ignore patterns, and default behavior.

## Real-World Example

Here's how you might use it in a typical development day:

```bash
# Morning: Check project health
ng-i18n-check --output summary

# During development: Check for missing keys in new feature
ng-i18n-check --output missing

# Before commit: Full check with verbose output
ng-i18n-check --verbose

# In CI/CD: Strict validation
ng-i18n-check --output missing --exit-on-issues --format json
```

## Getting Help

- Use `--help` to see all available options
- Use `--verbose` to see detailed analysis information
- Check the [Configuration Guide](/guide/configuration) for advanced options
- See [Output Sections](/guide/output-sections) for all section types

## Troubleshooting

**No translation files found?**
```bash
# Specify custom path
ng-i18n-check --locales-path ./custom/translations
```

**Too much output?**
```bash
# Show only what you need
ng-i18n-check --output summary
```

**Need to ignore certain keys?**
Create a config file and add ignore patterns:
```json
{
  "ignoreKeys": ["DEBUG.*", "TEMP.*"],
  "ignorePatterns": ["INTERNAL.*"]
}
```

## Next Steps

- Learn about all available [Configuration](/guide/configuration) options
- Explore [Output Sections](/guide/output-sections) for granular control
- See [Examples](/examples/) for more usage patterns
- Check [CI/CD Integration](/guide/ci-cd) for automation setup
