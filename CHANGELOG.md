# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
