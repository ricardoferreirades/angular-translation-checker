# Output Sections Feature

This feature allows you to selectively display specific sections of the translation analysis output, giving you granular control over what information is shown.

## Available Sections

- **summary**: Translation statistics and counts
- **dynamicPatterns**: Keys matched by dynamic patterns  
- **ignored**: Keys that are ignored by patterns/config
- **unused**: Keys that exist in translations but aren't used
- **missing**: Keys that are used in code but missing from translations
- **usedKeys**: All keys found in the codebase (verbose)
- **translationKeys**: All keys from translation files (verbose)
- **config**: Configuration used for analysis (verbose)

## Usage

### Command Line

```bash
# Show only summary and unused keys
ng-i18n-check --output summary,unused

# Show only ignored keys
ng-i18n-check --output ignored

# Show only missing keys for CI/CD validation
ng-i18n-check --output missing --exit-on-issues

# Multiple sections
ng-i18n-check --output summary,dynamicPatterns,unused,missing
```

### Configuration File

```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "outputSections": ["summary", "unused"],
  "verbose": false
}
```

### Programmatic Usage

```typescript
import { analyzeTranslations, ConsoleFormatter } from 'angular-translation-checker';

// Using main function with output format selection
const { result, output } = await analyzeTranslations(undefined, {
  localesPath: './src/assets/i18n',
  srcPath: './src',
  outputFormat: 'console'
});

console.log(output); // Pre-formatted with default sections

// Using formatters directly for custom sections
const formatter = new ConsoleFormatter();
const customOutput = await formatter.format(result, {
  sections: ['summary', 'unused']
});
console.log(customOutput);
```

## Output Formats

All sections work with all output formats:

### Console Output (default)
- **summary**: Formatted statistics
- **unused**: List with bullet points
- **missing**: List with bullet points  
- **ignored**: Grouped by patterns with counts
- **dynamicPatterns**: Grouped by pattern with counts

### JSON Output
- **summary**: Basic metadata always included
- **unused**: Array of unused keys
- **missing**: Array of missing keys
- **ignored**: Array of ignored keys
- **usedKeys**: Array of all used keys
- **translationKeys**: Array of all translation keys
- **dynamicPatterns**: Pattern match details
- **config**: Full configuration object

### CSV Output
- **unused**: Type "unused" entries
- **missing**: Type "missing" entries
- **ignored**: Type "ignored" entries
- **usedKeys**: Type "used" entries

## Examples

### Quick Health Check
```bash
ng-i18n-check --output summary
```

### CI/CD Pipeline
```bash
ng-i18n-check --output missing --format json --exit-on-issues
```

### Development Debugging
```bash
ng-i18n-check --output ignored,dynamicPatterns --verbose
```

### Clean Reports
```bash
ng-i18n-check --output unused,missing --config quiet-config.json
```

## Default Behavior

If no `outputSections` are specified, the default sections are:
- `summary`
- `dynamicPatterns` 
- `ignored`
- `unused`
- `missing`

This maintains backward compatibility with existing usage.
