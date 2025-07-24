# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-01-24

### Added
- **Granular Output Control**: New `--output` CLI option and `outputSections` configuration property
- **Selective Section Display**: Choose specific output sections (summary, unused, missing, ignored, dynamicPatterns, usedKeys, translationKeys, config)
- **Enhanced Format Support**: All output sections work across console, JSON, and CSV formats
- **New Configuration Examples**: Added `quiet-config.json` demonstrating output sections functionality
- **Comprehensive npm Scripts**: Added output section demo scripts for both library and example project
- **Updated Documentation**: New `docs/OUTPUT-SECTIONS.md` with detailed usage examples

### Enhanced
- **CLI Interface**: Extended help text with output sections documentation and examples
- **Configuration System**: Enhanced with new `outputSections` array property
- **Output Functions**: All format functions (`formatConsole`, `formatJSON`, `formatCSV`) support section filtering
- **Example Project**: New npm scripts demonstrating granular output control features

### Examples
```bash
# Show only summary and unused keys
ng-i18n-check --output summary,unused

# Show only ignored keys for debugging
ng-i18n-check --output ignored

# CI/CD validation with missing keys only
ng-i18n-check --output missing --exit-on-issues
```

## [1.0.0] - 2025-01-22

### Added
- Initial release of Angular Translation Checker
- Support for Angular translate pipe syntax detection
- Auto-detection of common Angular project structures
- Multiple output formats (console, JSON, CSV)
- Configuration file support with --init command
- CI/CD integration with --exit-on-issues flag
- Verbose mode for debugging
- Comprehensive test suite
- Full CLI interface with help and version commands
- Template configurations for different project types
- Programmatic API for integration with other tools

### Features
- Detects `{{ 'key' | translate }}` pipe usage
- Detects programmatic usage: `translate.get()`, `translate.instant()`
- Supports nested translation keys (e.g., `menu.home`)
- Excludes common directories (node_modules, dist, etc.)
- Zero dependencies for lightweight installation
- Cross-platform compatibility (Windows, macOS, Linux)

### Supported Patterns
- Template pipes: `'key' | translate`, `"key" | translate`, `` `key` | translate ``
- Service methods: `translate.get('key')`, `translate.instant('key')`
- Custom services: `translateService.*`, `translationService.*`

### Project Structures
- Standard Angular CLI projects
- Public folder i18n setup
- Nx workspace support
- Monorepo configurations
- Custom project structures via configuration
