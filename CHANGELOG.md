# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2025-07-27

### 🎉 **Major Release: Complete TypeScript Rewrite**

This release introduces a complete TypeScript-first architecture with modern development practices, professional user experience, and extensible plugin system.

### ✨ **New Features**

#### **TypeScript-First Architecture**
- **Full Type Safety**: Complete TypeScript implementation with strict mode enabled
- **Modern Build System**: TypeScript compilation with source maps and declaration files
- **Professional Development**: Enhanced developer experience with full IntelliSense support
- **Zero Breaking Changes**: Maintains complete backward compatibility with v1.4.x

#### **🔌 Extensible Plugin System**
- **5 Plugin Types**: Extractors, Analyzers, Formatters, Validators, and Reporters
- **Built-in Plugins**: Professional-grade plugins for TypeScript, HTML, and multiple output formats
- **Custom Plugin Support**: Full API for building custom analysis and reporting plugins
- **Plugin Manager**: Automatic plugin registration, initialization, and cleanup

#### **🎨 Enhanced User Experience**
- **Professional CLI**: Beautiful help system with 8 real-world examples and common workflows
- **Intelligent Error Handling**: Contextual error messages with actionable suggestions and troubleshooting
- **Modern Console Output**: Professional Unicode formatting with timestamps and language information
- **Enhanced Version Display**: Feature showcase with repository links and capability highlights

#### **📊 Advanced Reporting**
- **Professional Console Format**: Beautiful boxed headers with analysis timestamps
- **Enhanced JSON Output**: Structured reports with metadata and comprehensive analysis data
- **HTML Reports**: Rich, interactive reports with syntax highlighting and export capabilities
- **CSV Export**: Professional spreadsheet-compatible output for data analysis

#### **⚙️ Configuration Enhancements**
- **Smart Config Generation**: `--generate-config` creates intelligent configuration files
- **Enhanced Validation**: Comprehensive path validation with helpful error messages
- **Flexible Output Control**: Granular section control with professional formatting
- **Language Filtering**: Analyze specific languages with `--languages` option

### 🚀 **Technical Improvements**

#### **Architecture & Performance**
- **Event-Driven Design**: Professional event bus system for plugin communication
- **Memory Efficient**: Optimized processing with improved garbage collection
- **Async/Await**: Modern asynchronous patterns throughout the codebase
- **Error Boundaries**: Comprehensive error handling with graceful degradation

#### **Development Experience**
- **TypeScript Definitions**: Complete type definitions for IDE support
- **Source Maps**: Full debugging support with accurate line numbers
- **Build Scripts**: Professional npm script ecosystem for development
- **Testing Framework**: Enhanced test suite with TypeScript test files

#### **Code Quality**
- **Strict TypeScript**: Strict mode enabled with comprehensive type checking
- **Modern Patterns**: ES2020 target with modern JavaScript features
- **Clean Architecture**: Separation of concerns with well-defined interfaces
- **Documentation**: Comprehensive inline documentation and API references

### 📈 **Enhanced Capabilities**

- **Version Consistency**: Fixed all version mismatches across the application
- **Professional Logging**: Structured logging with debug, info, and error levels
- **Path Resolution**: Enhanced file system operations with better error handling
- **Pattern Matching**: Improved translation key detection with advanced regex patterns

### 🔧 **Migration & Compatibility**

- **Zero Breaking Changes**: All existing configurations and CLI options work unchanged
- **Backward Compatible**: Maintains full compatibility with v1.4.x projects
- **Progressive Enhancement**: New features are opt-in and don't affect existing workflows
- **Smooth Upgrade**: Simple `npm update` with optional config regeneration

### 📚 **Documentation Updates**

- **Comprehensive README**: Updated with TypeScript features, plugin architecture, and migration guide
- **API Documentation**: Complete TypeScript API reference with examples
- **Plugin Guide**: Detailed documentation for building custom plugins
- **Migration Guide**: Step-by-step guide for upgrading from v1.4 to v1.5

### 🧪 **Testing & Quality Assurance**

- **100% Test Coverage**: All features tested with comprehensive test suite
- **TypeScript Tests**: Enhanced test files with full type safety
- **Integration Testing**: End-to-end testing of CLI and plugin system
- **Performance Testing**: Validated performance improvements and memory usage

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
