# Examples

This section provides practical examples of using Angular Translation Checker in different scenarios. Whether you're just getting started or implementing advanced workflows, these examples will help you get the most out of the tool.

## ✈️ FlightFinder Demo Application

**Try the complete live example application that demonstrates all features!**

The FlightFinder is a comprehensive Angular application that showcases **all 21 configuration properties** of Angular Translation Checker with real-world usage patterns.

### 🌟 What's Included
- **Modern Flight Search Interface**: Clean UI similar to Google Flights
- **Multi-language Support**: English, Spanish, and French with real-time switching
- **Complex Translation Patterns**: All detection capabilities demonstrated
- **Enterprise Patterns**: SCREAMING_SNAKE_CASE and dynamic key generation
- **All 21 Configuration Properties**: Complete demonstration with practical examples

### 🚀 Quick Start with FlightFinder

```bash
# Clone the repository
git clone https://github.com/ricardoferreirades/angular-translation-checker.git
cd angular-translation-checker/example

# Install dependencies
npm install

# Run the application
npm start
# Visit: http://localhost:4200

# Test all configuration scenarios
./test-all-configs.sh
```

### 📊 Configuration Examples Demonstrated

The FlightFinder app demonstrates every configuration property:

**Core Properties:**
- `localesPath` - Translation files location
- `srcPath` - Source code analysis scope
- `keysExtensions` - File types to analyze
- `outputFormat` - Console, JSON, CSV outputs

**Analysis Options:**
- `excludeDirs` - Directory exclusion patterns
- `ignoreKeys` - Specific key ignoring
- `ignorePatterns` - Pattern-based ignoring
- `ignoreFiles` - File-level exclusions

**Output Control:**
- `outputSections` - Granular section control
- `verbose` - Detailed information display
- `exitOnIssues` - CI/CD integration

**And many more!** See the [complete configuration guide](/guide/configuration) for all 21 properties.

### 🎯 Specific Test Scenarios

```bash
# Basic configuration demo
npm run check:basic

# Advanced with all properties
npm run check:advanced

# TypeScript-only analysis
npm run check:typescript-only

# HTML-only analysis
npm run check:html-only

# File ignoring demonstration
npm run check:ignore-files

# Quiet mode for CI/CD
npm run check:quiet
```

---

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
