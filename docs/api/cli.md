# CLI Commands - TypeScript Edition

Angular Translation Checker v1.5.0 provides a modern, TypeScript-first command-line interface with professional user experience, intelligent error handling, and beautiful output formatting.

## 🚀 Installation

### Global Installation (Recommended)
```bash
npm install -g angular-translation-checker
```

### Local Installation  
```bash
npm install --save-dev angular-translation-checker
```

### Usage with npx
```bash
npx angular-translation-checker [options]
```

## 🎯 Basic Command

### `ng-i18n-check`

The main command for running translation analysis with enhanced TypeScript CLI.

```bash
ng-i18n-check [options]
```

**✨ New in v1.5.0:**
- Professional Unicode-formatted output with timestamps
- Intelligent error messages with actionable suggestions
- Enhanced help system with 8 real-world examples
- Beautiful version display with feature showcase

## 📋 Command Options

### Core Options

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `--config` | `-c` | string | `./.ng-i18n-check.json` | Configuration file path |
| `--src-path` | `-s` | string | `./src` | Source code directory |
| `--locales-path` | `-l` | string | `./src/assets/i18n` | Translation files directory |

### Output Control (Enhanced in v1.5.0)

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `--output` | `-o` | string | all sections | Comma-separated output sections |
| `--format` | `-f` | string | `console` | Output format: `console`, `json`, `csv`, `html` |
| `--exit-on-issues` | | boolean | `false` | Exit with error code if issues found |
| `--verbose` | `-v` | boolean | `false` | Enhanced verbose output with plugin information |

### New Options in v1.5.0

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `--generate-config` | | boolean | `false` | Generate intelligent configuration file |
| `--ignore-keys` | | string | | Ignore key patterns (comma-separated regex) |
| `--languages` | | string | | Specific languages to check (e.g., `en,es,fr`) |
| `--help` | `-h` | boolean | `false` | Show comprehensive help with examples |
| `--version` | | boolean | `false` | Show beautiful version display with features |

### Filtering Options

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `--ignore-keys` | | string[] | `[]` | Keys to ignore (comma-separated) |
| `--ignore-patterns` | | string[] | `[]` | Wildcard patterns to ignore |
| `--ignore-files` | | string[] | `[]` | Translation files to ignore |

### Utility Options

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `--help` | `-h` | | | Show help information |
| `--version` | | | | Show version number |
| `--init` | | | | Create default configuration file |

## Usage Examples

### Basic Usage

```bash
# Run with default settings
ng-i18n-check

# Use custom paths
ng-i18n-check --src-path ./apps/web/src --locales-path ./apps/web/assets/i18n

# Use configuration file
ng-i18n-check --config ./i18n-checker.config.json
```

### Output Control

```bash
# Show only summary
ng-i18n-check --output summary

# Show multiple sections
ng-i18n-check --output summary,missing,unused

# Generate JSON report
ng-i18n-check --format json > report.json

# Create CSV for analysis  
ng-i18n-check --format csv > analysis.csv
```

### Validation and CI/CD

```bash
# Fail if missing translations found
ng-i18n-check --output missing --exit-on-issues

# Strict validation
ng-i18n-check --max-missing 0 --max-unused 10 --exit-on-issues

# CI-friendly JSON output
ng-i18n-check --format json --quiet --exit-on-issues
```

### Filtering and Ignoring

```bash
# Ignore debug keys
ng-i18n-check --ignore-keys "debug.*,test.*"

# Ignore dynamic patterns
ng-i18n-check --ignore-dynamic

# Complex filtering
ng-i18n-check --ignore-keys "temp.*,*.debug,errors.old.*"
```

### Configuration Files

```bash
# Use specific config file
ng-i18n-check --config production.config.json

# Create default config
ng-i18n-check --init

# Override config with CLI options
ng-i18n-check --config base.json --output missing --exit-on-issues
```

## Output Sections

### Available Sections

| Section | Description | Use Case |
|---------|-------------|----------|
| `summary` | Overview statistics | Quick health check |
| `missing` | Keys used but not translated | Find incomplete translations |
| `unused` | Keys translated but not used | Cleanup opportunities |
| `usedKeys` | All keys found in code | Development debugging |
| `translationKeys` | All keys in translation files | Translation file audit |
| `dynamicPatterns` | Dynamic key patterns detected | Dynamic key analysis |
| `ignored` | Keys ignored by patterns | Verify ignore rules |
| `config` | Configuration used | Debug configuration |

### Section Combinations

```bash
# Development workflow
ng-i18n-check --output summary,missing

# Cleanup analysis
ng-i18n-check --output unused,ignored

# Complete audit
ng-i18n-check --output summary,missing,unused,dynamicPatterns

# CI validation
ng-i18n-check --output missing --exit-on-issues
```

## Exit Codes

| Code | Description | When It Occurs |
|------|-------------|----------------|
| `0` | Success | No issues found or `--exit-on-issues` not set |
| `1` | Translation issues found | Missing/unused keys exceed limits |
| `2` | Configuration error | Invalid config file or options |
| `3` | File system error | Cannot read source or translation files |
| `4` | Invalid arguments | Incorrect command line options |

### Exit Code Examples

```bash
# Check exit code in scripts
ng-i18n-check --exit-on-issues
if [ $? -eq 0 ]; then
  echo "All translations valid"
else
  echo "Translation issues found"
  exit 1
fi

# Use in conditionals
ng-i18n-check --output missing --exit-on-issues && npm run build
```

## Advanced Usage

### Environment Variables

```bash
# Set default options via environment
export NG_I18N_CONFIG="./configs/production.json"
export NG_I18N_FORMAT="json"
export NG_I18N_OUTPUT="summary,missing"

ng-i18n-check  # Uses environment defaults
```

### Piping and Redirection

```bash
# Process JSON output
ng-i18n-check --format json | jq '.summary.coverage'

# Filter console output
ng-i18n-check | grep "Missing"

# Combine with other tools
ng-i18n-check --format csv | sort -t, -k1,1

# Log output
ng-i18n-check --verbose > translation.log 2>&1
```

### Parallel Processing

```bash
# Check multiple projects
for project in web mobile admin; do
  ng-i18n-check --config ${project}.config.json &
done
wait

# Language-specific checks
for lang in en es fr de; do
  ng-i18n-check --languages ${lang} --output missing > ${lang}-missing.txt &
done
wait
```

## Configuration File Integration

### CLI Overrides Configuration

Command line options always override configuration file settings:

```bash
# Config file has exitOnIssues: false
# CLI option overrides to true
ng-i18n-check --config lenient.json --exit-on-issues
```

### Priority Order

1. Command line options (highest priority)
2. Configuration file settings
3. Environment variables
4. Default values (lowest priority)

## Debugging Commands

### Verbose Output

```bash
# Detailed operation information
ng-i18n-check --verbose

# Show configuration being used
ng-i18n-check --output config

# Debug pattern matching
ng-i18n-check --output dynamicPatterns,ignored --verbose
```

### Dry Run Mode

```bash
# Show what would be analyzed without processing
ng-i18n-check --dry-run --verbose

# Validate configuration
ng-i18n-check --config test.json --dry-run
```

## Integration Examples

### Package.json Scripts

```json
{
  "scripts": {
    "translations:check": "ng-i18n-check",
    "translations:validate": "ng-i18n-check --output missing --exit-on-issues",
    "translations:report": "ng-i18n-check --format json > reports/translations.json",
    "translations:cleanup": "ng-i18n-check --output unused --format csv > cleanup.csv",
    "translations:summary": "ng-i18n-check --output summary --quiet"
  }
}
```

### Git Hooks

```bash
#!/bin/sh
# pre-commit hook
ng-i18n-check --output missing --exit-on-issues --quiet
```

### CI/CD Integration

```bash
# GitHub Actions
- name: Validate Translations
  run: ng-i18n-check --config ci.json --exit-on-issues

# GitLab CI
script:
  - ng-i18n-check --format json --output missing --exit-on-issues

# Jenkins
sh 'ng-i18n-check --config ${ENV}.config.json --exit-on-issues'
```

## Error Handling

### Common Errors

```bash
# Configuration file not found
ng-i18n-check --config missing.json
# Error: Configuration file 'missing.json' not found

# Invalid output section
ng-i18n-check --output invalid
# Error: Unknown output section 'invalid'

# Invalid format
ng-i18n-check --format xml
# Error: Unsupported format 'xml'
```

### Error Recovery

```bash
# Graceful error handling
ng-i18n-check --output missing 2>/dev/null || {
  echo "Translation check failed, using defaults"
  ng-i18n-check --output summary
}
```

## Performance Considerations

### Large Projects

```bash
# Limit output for performance
ng-i18n-check --output summary --quiet

# Process specific directories
ng-i18n-check --src-path src/app/core

# Use streaming for large outputs
ng-i18n-check --format json --stream > large-report.json
```

### Memory Usage

```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 ./node_modules/.bin/ng-i18n-check

# Or set via environment
export NODE_OPTIONS="--max-old-space-size=4096"
ng-i18n-check
```

## Best Practices

1. **Use Configuration Files**: Store common options in config files
2. **Script Integration**: Add to package.json scripts for team consistency
3. **CI/CD Ready**: Use `--exit-on-issues` for automated validation
4. **Appropriate Output**: Choose the right format for your use case
5. **Error Handling**: Always handle exit codes in scripts
6. **Documentation**: Document custom configurations and patterns

## Quick Reference

### Most Common Commands

```bash
# Quick health check
ng-i18n-check --output summary

# Find missing translations
ng-i18n-check --output missing

# Generate cleanup report
ng-i18n-check --output unused --format csv

# CI validation
ng-i18n-check --output missing --exit-on-issues

# Full analysis
ng-i18n-check --output summary,missing,unused,dynamicPatterns
```

### Configuration Shortcuts

```bash
# Create config file
ng-i18n-check --init

# Test configuration
ng-i18n-check --config test.json --dry-run

# Override key settings
ng-i18n-check --config base.json --languages en,es --exit-on-issues
```

For more detailed examples and use cases, see our [examples section](/examples/) or [configuration guide](/guide/configuration).
