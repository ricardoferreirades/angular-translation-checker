# Output Sections

The `--output` option gives you granular control over what information is displayed. Instead of seeing everything at once, you can focus on exactly what you need for your current task.

## Available Sections

### `summary`
Shows the high-level overview of your translation analysis.

```bash
ng-i18n-check --output summary
```

```
Translation Analysis Results:
   Total translation keys: 107
   Used keys (static): 31
   Used keys (dynamic patterns): 28
   Ignored keys: 6
   Unused keys: 63
   Missing keys: 8
```

### `unused`
Lists all translation keys that exist in your translation files but aren't used in your code.

```bash
ng-i18n-check --output unused
```

```
Unused translation keys:
   - AIRLINES.AMERICAN
   - AIRLINES.DELTA
   - BUTTONS.CANCEL
   - LEGACY.OLD_FEATURE
   - TEMP.DEBUG_MESSAGE
```

### `missing`
Shows translation keys that are referenced in your code but don't exist in translation files.

```bash
ng-i18n-check --output missing
```

```
Missing translation keys:
   - COMMON.ERROR.MESSAGE
   - DASHBOARD.NEW_WIDGET.TITLE
   - PROFILE.SETTINGS.PRIVACY
```

### `ignored`
Displays keys that are intentionally ignored based on your configuration patterns.

```bash
ng-i18n-check --output ignored
```

```
Ignored translation keys:
   📍 Exact matches:
      "favicon.ico": 1 key(s)
   Pattern matches:
      "DEBUG.*": 3 key(s)
      "TEMP.*": 2 key(s)
```

### `dynamicPatterns`
Shows keys that are matched by dynamic patterns detected in your code.

```bash
ng-i18n-check --output dynamicPatterns
```

```
Keys matched by dynamic patterns:
   "FLIGHT.RESULTS.*": 14 key(s)
   "COMMON.LOADING.*": 6 key(s)
   "NOTIFICATIONS.*.TITLE": 3 key(s)
```

### `usedKeys`
Lists all translation keys that are actively used in your code.

```bash
ng-i18n-check --output usedKeys
```

### `translationKeys`
Shows all keys found in your translation files.

```bash
ng-i18n-check --output translationKeys
```

### `config`
Displays the current configuration being used (useful for debugging).

```bash
ng-i18n-check --output config
```

## Combining Sections

You can combine multiple sections using comma separation:

### Development Focus
```bash
# Show summary and missing keys for active development
ng-i18n-check --output summary,missing
```

### Cleanup Focus
```bash
# Show summary and unused keys for cleanup tasks
ng-i18n-check --output summary,unused
```

### Debug Focus
```bash
# Show everything except config for comprehensive debugging
ng-i18n-check --output summary,dynamicPatterns,ignored,unused,missing
```

### CI/CD Focus
```bash
# Show only missing keys for build validation
ng-i18n-check --output missing --exit-on-issues
```

## Configuration File

You can set default output sections in your configuration file:

```json
{
  "outputSections": ["summary", "unused", "missing"],
  "outputFormat": "console",
  "exitOnIssues": false
}
```

This way, you only need to specify `--output` when you want different sections than your defaults.

## Use Cases

## Real-World Scenarios

### **Translation Cleanup**
Perfect for identifying and removing unused translations:

```bash
ng-i18n-check --output unused
```

Review the list, remove unused keys from your translation files, then verify:

```bash
ng-i18n-check --output summary
```

### **Missing Translation Detection**
Ideal for development and QA workflows:

```bash
ng-i18n-check --output missing
```

### **CI/CD Pipeline Integration**
Use specific sections for different pipeline stages:

```bash
# Fail build if translations are missing
ng-i18n-check --output missing --exit-on-issues

# Generate cleanup report
ng-i18n-check --output unused --format json > unused-translations.json
```

### 🐛 **Debugging Translation Issues**
When you need to understand what's happening:

```bash
# See everything with verbose logging
ng-i18n-check --output summary,dynamicPatterns,ignored --verbose
```

### **Reporting and Analytics**
Generate specific reports for stakeholders:

```bash
# Executive summary
ng-i18n-check --output summary --format json

# Detailed cleanup report
ng-i18n-check --output unused,ignored --format csv
```

## Format Compatibility

All output sections work with every output format:

### Console Format (Default)
Beautiful, colorful output with emojis and clear sections:
```bash
ng-i18n-check --output summary,unused --format console
```

### JSON Format
Structured data perfect for processing:
```bash
ng-i18n-check --output summary,unused --format json
```

### CSV Format  
Tabular data for spreadsheet analysis:
```bash
ng-i18n-check --output unused,missing --format csv
```

## Advanced Examples

### Custom Workflow Scripts

Create npm scripts for common workflows:

```json
{
  "scripts": {
    "translations:check": "ng-i18n-check --output summary",
    "translations:cleanup": "ng-i18n-check --output unused",
    "translations:missing": "ng-i18n-check --output missing",
    "translations:full": "ng-i18n-check --verbose",
    "translations:ci": "ng-i18n-check --output missing --exit-on-issues --format json"
  }
}
```

### Configuration Presets

Create different config files for different purposes:

**cleanup.config.json**
```json
{
  "outputSections": ["summary", "unused"],
  "outputFormat": "console",
  "verbose": false
}
```

**ci.config.json**
```json
{
  "outputSections": ["missing"],
  "outputFormat": "json", 
  "exitOnIssues": true,
  "verbose": false
}
```

Use them with:
```bash
ng-i18n-check --config cleanup.config.json
ng-i18n-check --config ci.config.json
```

## Backward Compatibility

::: tip No Breaking Changes
The `--output` option is completely optional. If you don't specify it, you'll get the same comprehensive output as before, showing all sections.
:::

```bash
# These are equivalent:
ng-i18n-check
ng-i18n-check --output summary,dynamicPatterns,ignored,unused,missing
```

## Next Steps

- See [Configuration](/guide/configuration) for setting up default output sections
- Check [Examples](/examples/output-formats) for real-world usage patterns
- Learn about [CI/CD Integration](/guide/ci-cd) for automated workflows
