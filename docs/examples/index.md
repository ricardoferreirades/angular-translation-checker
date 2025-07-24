# Examples

This section provides practical examples of using Angular Translation Checker in different scenarios. Whether you're just getting started or implementing advanced workflows, these examples will help you get the most out of the tool.

## Quick Examples

### Basic Health Check
```bash
# Get an overview of your translation status
ng-i18n-check --output summary
```

### Find Cleanup Opportunities
```bash
# List unused translations for cleanup
ng-i18n-check --output unused
```

### Development Workflow
```bash
# Check for missing translations during development
ng-i18n-check --output missing
```

### CI/CD Validation
```bash
# Fail build if translations are missing
ng-i18n-check --output missing --exit-on-issues
```

## Common Scenarios

### 🧹 **Translation Cleanup**
Remove unused translations to keep your files lean:

```bash
# 1. Find unused translations
ng-i18n-check --output unused

# 2. Review and remove them from translation files

# 3. Verify the cleanup
ng-i18n-check --output summary
```

### 🔍 **Pre-commit Validation**
Ensure translations are complete before committing:

```bash
# Add to your pre-commit hook
ng-i18n-check --output missing --exit-on-issues
```

### 📊 **Generate Reports**
Create reports for stakeholders:

```bash
# Executive summary in JSON
ng-i18n-check --output summary --format json > translation-summary.json

# Detailed cleanup report in CSV
ng-i18n-check --output unused --format csv > unused-translations.csv
```

## Browse Examples

- [Basic Usage](/examples/basic-usage) - Simple day-to-day commands
- [Configuration Examples](/examples/configurations) - Different config setups
- [Output Formats](/examples/output-formats) - Console, JSON, and CSV examples
- [CI/CD Integration](/examples/ci-cd) - Automated pipeline setups

## Real-World Workflows

### Development Team Workflow
```json
{
  "scripts": {
    "translations:check": "ng-i18n-check --output summary",
    "translations:unused": "ng-i18n-check --output unused",
    "translations:missing": "ng-i18n-check --output missing",
    "translations:ci": "ng-i18n-check --output missing --exit-on-issues"
  }
}
```

### Multi-Environment Setup
```bash
# Development - show everything
ng-i18n-check --config dev.config.json

# Staging - focus on issues  
ng-i18n-check --config staging.config.json --output missing,unused

# Production - strict validation
ng-i18n-check --config prod.config.json --exit-on-issues
```

Ready to dive deeper? Check out the specific example pages above for detailed code samples and explanations.
