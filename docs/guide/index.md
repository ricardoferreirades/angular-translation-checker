# Guide

Welcome to the Angular Translation Checker documentation! This comprehensive tool helps you maintain translation quality in Angular applications using ngx-translate.

## Try the FlightFinder Demo First!

**See Angular Translation Checker in action with a complete Angular application!**

The [FlightFinder Demo](/examples/flightfinder) is a comprehensive Angular app that demonstrates **all features** with real-world usage patterns:

- **Modern Flight Search Interface** with multi-language support
- **All 21 configuration properties** demonstrated
- **Complex translation patterns** including dynamic keys
- **Enterprise naming conventions** (SCREAMING_SNAKE_CASE)
- **Live example** you can run and explore

```bash
# Quick start with FlightFinder
git clone https://github.com/ricardoferreirades/angular-translation-checker.git
cd angular-translation-checker/example
npm install && npm start
```

[Explore FlightFinder Demo →](/examples/flightfinder)

---

## What is Angular Translation Checker?

Angular Translation Checker is a powerful command-line tool and Node.js library that analyzes your Angular project to provide insights about:

- **Find unused translations** - Clean up your translation files
- **Detect missing translations** - Ensure complete localization
- **Generate comprehensive reports** - Monitor translation health
- **Integrate with CI/CD** - Automate translation validation
- **Support multiple output formats** - Console, JSON, and CSV

## Quick Overview

### Key Features

- **Smart Pattern Detection**: Automatically finds translation keys in TypeScript, HTML, and JavaScript files
- **Granular Output Control**: Choose exactly what information you want to see
- **Dynamic Key Support**: Handles dynamic translation key patterns
- **Flexible Configuration**: Customize behavior for your project needs
- **CI/CD Ready**: Perfect for automated build pipelines

### Use Cases

- **Development Workflow**: Validate translations during development
- **Code Reviews**: Ensure translation completeness before merging
- **Continuous Integration**: Fail builds if translations are incomplete
- **Project Maintenance**: Regular cleanup of unused translations
- **Multi-language Projects**: Manage complex translation scenarios

## Getting Started

### Quick Installation
```bash
npm install -g angular-translation-checker
```

### Basic Usage
```bash
# Check translation status
ng-i18n-check

# Show only missing translations
ng-i18n-check --output missing

# Generate JSON report
ng-i18n-check --format json > report.json
```

## Navigation Guide

This documentation is organized into several sections:

## Next Steps

### **Guide Sections**
- [**Installation**](/guide/installation) - Set up the tool in your project
- [**Quick Start**](/guide/quick-start) - Get running in minutes
- [**Configuration**](/guide/configuration) - Customize for your needs
- [**Output Sections**](/guide/output-sections) - Control what you see
- [**Troubleshooting**](/guide/troubleshooting) - Solve common issues

### **Examples**
- [**Overview**](/examples/) - Practical usage examples
- Real-world scenarios and solutions

### **API Reference**
- [**API Documentation**](/api/) - Complete API reference
- Function signatures and options

## Core Concepts

### Translation Analysis
The tool analyzes your project by:
1. Scanning source files for translation key usage
2. Reading translation files to get available keys
3. Comparing usage vs availability
4. Generating detailed reports

### Output Sections
Control exactly what information you see:
- `summary` - Overview statistics
- `missing` - Missing translation keys
- `unused` - Unused translation keys
- `usedKeys` - All used keys
- `translationKeys` - All available keys
- `dynamicPatterns` - Dynamic key patterns
- `ignored` - Ignored keys
- `config` - Configuration used

### Configuration Flexibility
Customize the tool through:
- Configuration files (JSON)
- Command-line options
- Environment variables
- Multiple configuration profiles

## Common Workflows

### Development Workflow
```bash
# Daily development check
ng-i18n-check --output summary

# Before committing changes
ng-i18n-check --output missing --exit-on-issues
```

### CI/CD Integration
```bash
# In your CI pipeline
ng-i18n-check --output missing --format json --exit-on-issues
```

### Translation Maintenance
```bash
# Find cleanup opportunities
ng-i18n-check --output unused

# Generate stakeholder report
ng-i18n-check --output summary --format csv > translation-report.csv
```

## What's New in v1.3.x

### Granular Output Control
The new `--output` option lets you choose exactly what information to display:
```bash
ng-i18n-check --output summary,missing,unused
```

### Enhanced Configuration
More flexible configuration options:
```json
{
  "outputSections": ["summary", "missing"],
  "exitOnIssues": true,
  "maxMissing": 0
}
```

### Multiple Output Formats
Choose from console, JSON, or CSV output:
```bash
ng-i18n-check --format json
ng-i18n-check --format csv
```

## Need Help?

- **Quick Issues**: Check the [Troubleshooting Guide](/guide/troubleshooting)
- **Examples**: Browse [practical examples](/examples/)
- **API Details**: See the [complete API reference](/api/)
- **Bug Reports**: [Open an issue on GitHub](https://github.com/ricardoferreirades/angular-translation-checker/issues)

Ready to get started? Head over to the [Installation Guide](/guide/installation) to set up Angular Translation Checker in your project!
ng-i18n-check --output summary,missing

# Show everything except ignored keys
ng-i18n-check --output summary,unused,missing,dynamicPatterns
```

### **Flexible Configuration**
- JSON-based configuration files
- Ignore patterns for keys, files, and directories
- Custom file extensions and paths
- Regex and wildcard pattern support

### **CI/CD Integration**
- Exit codes for automated validation
- JSON and CSV output formats
- Configurable error handling
- Perfect for build pipelines

## How It Works

1. **Discovery**: Automatically detects your project structure and translation files
2. **Analysis**: Scans your source code for translation key usage
3. **Pattern Matching**: Identifies dynamic translation patterns
4. **Reporting**: Generates detailed reports in your preferred format
5. **Validation**: Optionally fails builds when issues are found

## Common Use Cases

### Development Workflow
```bash
# Quick health check during development
ng-i18n-check --output summary

# Find translations to clean up
ng-i18n-check --output unused
```

### Code Review
```bash
# Generate detailed report for review
ng-i18n-check --format json > translation-report.json
```

### CI/CD Pipeline
```bash
# Fail build if translations are missing
ng-i18n-check --output missing --exit-on-issues
```

### Maintenance
```bash
# Full analysis with verbose logging
ng-i18n-check --verbose --output summary,unused,missing
```

## Architecture

Angular Translation Checker uses a multi-phase approach:

1. **Configuration Loading**: Merges default settings with your custom configuration
2. **File Discovery**: Finds translation files and source code files
3. **Key Extraction**: Parses translation files to build a complete key inventory  
4. **Usage Analysis**: Scans source code for translation key references
5. **Pattern Matching**: Applies dynamic patterns to find computed keys
6. **Report Generation**: Formats results according to your specifications

## Next Steps

Ready to get started? Check out our [Installation Guide](/guide/installation) to set up Angular Translation Checker in your project, or jump to [Quick Start](/guide/quick-start) for a hands-on introduction.

For detailed configuration options, see our [Configuration Guide](/guide/configuration) or explore the [Output Sections](/guide/output-sections) documentation to learn about the new granular output control feature.
