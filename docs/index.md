---
layout: home

hero:
  name: "Angular Translation Checker"
  text: "Analyze translation keys with precision"
  tagline: "A comprehensive tool for analyzing translation keys in Angular projects using ngx-translate with granular output control"
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/ricardoferreirades/angular-translation-checker

features:
  - icon: 🔍
    title: Smart Analysis
    details: Automatically detects used, unused, and missing translation keys across your Angular project with advanced pattern matching.
    
  - icon: 🎯
    title: Granular Output Control
    details: Choose exactly what to display with the new --output option. Show only unused keys, missing translations, or custom combinations.
    
  - icon: ⚙️
    title: Highly Configurable
    details: Flexible configuration options including ignore patterns, file exclusions, and custom dynamic pattern detection.
    
  - icon: 🚀
    title: CI/CD Ready
    details: Perfect for continuous integration with exit codes, JSON output, and automated translation validation.
    
  - icon: 📊
    title: Multiple Output Formats
    details: Support for console, JSON, and CSV output formats to fit your workflow and reporting needs.
    
  - icon: 🔧
    title: Developer Friendly
    details: Auto-detection of project structure, comprehensive CLI options, and detailed verbose logging for debugging.
---

## Quick Example

```bash
# Install globally
npm install -g angular-translation-checker

# Basic analysis
ng-i18n-check

# Show only unused translations
ng-i18n-check --output unused

# Generate JSON report for CI/CD
ng-i18n-check --format json --exit-on-issues
```

## What's New in v1.3.5+

::: info New Feature: Granular Output Control
The new `--output` option lets you choose exactly what sections to display:
- `summary` - Translation analysis overview
- `unused` - Unused translation keys
- `missing` - Missing translation keys
- `ignored` - Ignored keys by patterns
- `dynamicPatterns` - Keys matched by dynamic patterns

```bash
# Show only summary and unused keys
ng-i18n-check --output summary,unused

# Perfect for CI/CD - check only for issues
ng-i18n-check --output missing --exit-on-issues
```
:::

## Why Angular Translation Checker?

Managing translations in large Angular applications can be challenging. This tool helps you:

- **Identify unused translations** that can be safely removed
- **Find missing translations** before they cause runtime errors  
- **Validate translation usage** in your CI/CD pipeline
- **Maintain clean translation files** as your project grows
- **Debug translation issues** with detailed verbose output

## Trusted by Developers

Angular Translation Checker is designed to handle real-world Angular projects with complex translation patterns, dynamic key generation, and large codebases.
