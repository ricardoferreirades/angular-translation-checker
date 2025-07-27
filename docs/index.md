---
layout: home

hero:
  name: "Angular Translation Checker"
  text: "TypeScript-First Translation Analysis"
  tagline: "A modern, plugin-based translation analysis tool with TypeScript architecture, professional reporting, and extensible design for Angular projects"
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: What's New in v1.5.0
      link: /guide/migration-v1.5
    - theme: alt
      text: View on GitHub
      link: https://github.com/ricardoferreirades/angular-translation-checker

features:
  - title: 🛡️ TypeScript-First Architecture (v1.5.0)
    details: Complete TypeScript implementation with strict mode, full type safety, and professional development experience with IntelliSense support.
    
  - title: 🔌 Extensible Plugin System
    details: Build custom extractors, analyzers, formatters, and reporters with the new plugin architecture. 5+ plugin types available.
    
  - title: 🎨 Professional User Experience
    details: Beautiful CLI with intelligent error handling, contextual suggestions, and professional Unicode formatting with timestamps.
    
  - title: 📊 Advanced Reporting & Output
    details: Multiple formats (Console, JSON, CSV, HTML) with granular section control, metadata, and interactive reports.
    
  - title: 🚀 Modern Development Stack
    details: Event-driven architecture, async/await patterns, comprehensive testing, and zero dependencies with TypeScript definitions.
    
  - title: 🔄 CI/CD Integration
    details: Enhanced exit codes, JSON reports, automated validation, and professional error handling for continuous integration pipelines.
---

## Quick Example

```bash
# Install globally
npm install -g angular-translation-checker

# Basic analysis with new TypeScript CLI
ng-i18n-check

# Generate configuration file (new in v1.5.0)
ng-i18n-check --generate-config

# Professional verbose output with timestamps
ng-i18n-check -v --output summary,unused,missing

# Generate JSON report for CI/CD with metadata
ng-i18n-check --format json --exit-on-issues > translation-report.json

# Check specific languages only
ng-i18n-check --languages en,es,fr
```

## ✨ What's New in v1.5.0

- **🎉 Complete TypeScript Rewrite** - Full type safety and modern architecture
- **🔌 Plugin System** - Extensible design with 5+ plugin types
- **🎨 Enhanced UX** - Professional CLI with beautiful formatting
- **📊 Rich Reporting** - HTML reports, enhanced JSON, and professional console output
- **⚙️ Smart Config** - Intelligent configuration generation
- **🔄 Zero Breaking Changes** - Seamless upgrade from v1.4.x

[Learn more about the TypeScript migration →](/guide/migration-v1.5)

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
