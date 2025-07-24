# ✈️ FlightFinder Demo Application

The FlightFinder is a comprehensive Angular application that demonstrates **all 21 configuration properties** of Angular Translation Checker in real-world scenarios. This modern flight search application showcases complex translation patterns, multilingual support, and enterprise-level naming conventions.

## 🌟 Application Features

### Flight Search Interface
- **Modern UI Design**: Clean interface similar to Google Flights
- **Responsive Layout**: Works on desktop and mobile devices
- **Interactive Elements**: Search forms, filters, and booking flows

### Multilingual Support
- **3 Languages**: English, Spanish, and French
- **Real-time Switching**: Dynamic language change without page reload
- **Complete Translations**: All UI elements properly translated
- **Complex Key Patterns**: Nested objects, arrays, and dynamic content

### Enterprise Translation Patterns
- **SCREAMING_SNAKE_CASE**: Business-standard naming conventions
- **Dynamic Key Generation**: Runtime key construction
- **Template Interpolation**: Complex Angular template patterns
- **Service Integration**: TranslateService usage examples

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/ricardoferreirades/angular-translation-checker.git
cd angular-translation-checker/example

# Install dependencies
npm install
```

### Running the Application

```bash
# Start the development server
npm start

# Open your browser
# http://localhost:4200
```

### Testing Translation Analysis

```bash
# Run all configuration tests
./test-all-configs.sh

# Quick validation
./quick-validate.sh

# Generate all config examples
./generate-configs.sh
```

## 📊 Configuration Demonstrations

The FlightFinder application demonstrates **ALL 21** configuration properties with practical examples:

### Core Configuration (5 properties)
```bash
# Basic setup demonstration
npm run check:basic
```

**Properties covered:**
- `localesPath`: `./src/assets/i18n`
- `srcPath`: `./src`
- `keysExtensions`: `['.ts', '.html']`
- `configFile`: Custom configuration loading
- `outputFormat`: Console, JSON, CSV examples

### Analysis Options (6 properties)
```bash
# Advanced configuration demo
npm run check:advanced
```

**Properties covered:**
- `excludeDirs`: Exclude node_modules, dist, etc.
- `ignoreKeys`: Specific keys to ignore
- `ignorePatterns`: Pattern-based ignoring
- `ignoreFiles`: File-level exclusions
- `exitOnIssues`: CI/CD integration
- `verbose`: Detailed output control

### Output Control (3 properties)
```bash
# Output section demonstration
npm run check:quiet
```

**Properties covered:**
- `outputSections`: Granular control over displayed sections
- `verbose`: Enable/disable detailed information
- `outputFormat`: Multiple format support

### File Processing (7 properties)
```bash
# File-specific tests
npm run check:typescript-only
npm run check:html-only
npm run check:ignore-files
```

**Properties covered:**
- `keysExtensions`: File type filtering
- `excludeDirs`: Directory exclusion
- `ignoreFiles`: Individual file ignoring
- `srcPath`: Source directory specification
- `localesPath`: Translation directory location
- Plus advanced file handling options

## 🎯 Real-World Translation Patterns

### 1. Template Interpolation
```html
<!-- FlightFinder uses complex template patterns -->
<h1>{{ 'FLIGHT_SEARCH.TITLE' | translate }}</h1>
<span>{{ 'BOOKING.PASSENGER_COUNT' | translate: { count: passengers } }}</span>
```

### 2. Dynamic Key Construction
```typescript
// Runtime key generation
const statusKey = `FLIGHT_STATUS.${flight.status.toUpperCase()}`;
const message = this.translate.instant(statusKey);
```

### 3. Service Integration
```typescript
// TranslateService usage
constructor(private translate: TranslateService) {}

getFlightTitle(type: string): string {
  return this.translate.instant(`FLIGHT_TYPES.${type}`);
}
```

### 4. Complex Nested Keys
```json
{
  "FLIGHT_SEARCH": {
    "FILTERS": {
      "PRICE_RANGE": {
        "MIN": "Minimum price",
        "MAX": "Maximum price"
      }
    }
  }
}
```

## 📁 Project Structure

```
example/
├── src/
│   ├── app/
│   │   ├── components/          # Flight search components
│   │   ├── services/           # Translation services
│   │   └── models/             # TypeScript interfaces
│   ├── assets/
│   │   └── i18n/              # Translation files
│   │       ├── en.json        # English translations
│   │       ├── es.json        # Spanish translations
│   │       └── fr.json        # French translations
├── configs/                    # All 21 config examples
│   ├── basic.config.json
│   ├── advanced.config.json
│   ├── typescript-only.config.json
│   └── ...
└── results/                    # Analysis output examples
```

## 🧪 Test Scenarios

### Basic Health Check
```bash
npm run check:basic
# Demonstrates: basic configuration, standard patterns
```

### Advanced Analysis
```bash
npm run check:advanced
# Demonstrates: all properties, complex patterns, enterprise features
```

### File Type Filtering
```bash
npm run check:typescript-only  # Only .ts files
npm run check:html-only        # Only .html files
```

### Ignore Patterns
```bash
npm run check:ignore-files     # File exclusion
npm run check:ignore-keys      # Key exclusion
```

### CI/CD Integration
```bash
npm run check:quiet           # Minimal output for automation
npm run check:exit-on-issues  # Fail on problems
```

## 🎨 UI Screenshots

The FlightFinder application provides a visual demonstration of:

- **Search Interface**: Modern flight search with date pickers and filters
- **Results Display**: Flight listings with prices and details
- **Language Switcher**: Real-time language change demonstration
- **Booking Flow**: Multi-step process with form validation
- **Error States**: Translation of error messages and validation text

## 🔧 Configuration Files

The example includes **comprehensive configuration files** for every scenario:

- `configs/basic.config.json` - Minimal setup
- `configs/advanced.config.json` - All 21 properties
- `configs/typescript-only.config.json` - TypeScript-only analysis
- `configs/html-only.config.json` - Template-only analysis
- `configs/ignore-files.config.json` - File exclusion demo
- `configs/quiet-config.json` - CI/CD optimized
- And more...

## 📈 Expected Analysis Results

When you run the FlightFinder analysis, you'll see:

- **Translation Files**: 3 language files with ~150 keys each
- **Source Files**: ~20 TypeScript and HTML files analyzed
- **Dynamic Patterns**: Complex key construction detection
- **Unused Keys**: Demonstration of cleanup opportunities
- **Missing Keys**: Intentional gaps for testing purposes

## 🔗 Related Documentation

- [Configuration Guide](/guide/configuration) - Complete property reference
- [CLI Commands](/api/cli) - Command-line usage
- [Output Sections](/guide/output-sections) - Understanding analysis results
- [Basic Usage](/examples/basic-usage) - Simple examples
- [CI/CD Integration](/examples/ci-cd) - Automation examples

## 🤝 Contributing to the Example

The FlightFinder example is continuously improved. To contribute:

1. **Add new translation patterns** to demonstrate edge cases
2. **Improve the UI** to showcase more complex scenarios
3. **Add new configuration examples** for specific use cases
4. **Enhance documentation** with more detailed explanations

---

**💡 The FlightFinder example is the best way to understand Angular Translation Checker's full capabilities in a real-world context!**
