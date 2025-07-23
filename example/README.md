# ✈️ FlightFinder - Angular Translation Checker Example

A comprehensive Angular application demonstrating real-world usage of `angular-translation-checker` with ngx-translate. This modern flight search application showcases complex translation patterns, multilingual support, and enterprise-level naming conventions.

## 🌟 Live Demo Features

- **✈️ Flight Search Interface**: Modern UI similar to Google Flights
- **🌐 Multi-language Support**: English, Spanish, and French with real-time switching
- **🎯 Complex Translation Patterns**: Demonstrates all detection capabilities
- **🏢 Enterprise Patterns**: SCREAMING_SNAKE_CASE and dynamic key generation
- **🎨 Clean Design**: Simple color scheme with white, gray, and light blue

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the application:**
   ```bash
   npm start
   ```
   Visit: http://localhost:4200

3. **Analyze translations:**
   ```bash
   npm run check-translations
   ```

4. **Verbose analysis:**
   ```bash
   npm run check-translations-verbose
   ```

5. **Generate JSON report:**
   ```bash
   npm run check-translations-json
   ```

## 📊 Analysis Results

When you run the translation checker on this example, you'll see:

```bash
🔍 Analyzing translations...

📊 Translation Analysis Results:
   Total translation keys: 78
   Used keys: 78
   Static patterns detected: 25+
   Dynamic patterns detected: 7+
   Missing keys: 0
   Unused keys: 0

✅ Perfect translation coverage!
```

## 📁 Project Structure

```
example/
├── src/
│   ├── app/
│   │   ├── app.component.ts        # Main component with language switching
│   │   ├── app.component.css       # Clean design with light colors
│   │   └── services/
│   │       └── notification.service.ts  # Complex translation patterns
│   └── assets/
│       └── i18n/                   # Translation files
│           ├── en.json             # English translations
│           ├── es.json             # Spanish translations
│           └── fr.json             # French translations
├── i18n-checker.config.json       # Translation checker configuration
├── .gitignore                      # Git ignore for Angular projects
└── package.json                    # Dependencies and scripts
```

## 🎯 Translation Patterns Demonstrated

This FlightFinder application showcases every translation pattern the checker can detect:

### 1. Static Template Pipes
```html
<!-- Basic translation pipes -->
<h1>{{ 'FLIGHT.SEARCH.TITLE' | translate }}</h1>
<p>{{ 'NAVIGATION.SIGN_IN' | translate }}</p>
```

### 2. Dynamic Template Interpolation
```html
<!-- Language-specific dynamic keys -->
<p>{{ 'COMMON.LANGUAGE.' + currentLanguage.toUpperCase() | translate }}</p>
<div>{{ `FLIGHT.RESULTS.${resultType}` | translate }}</div>
```

### 3. Service Usage Patterns
```typescript
// Standard service calls
this.translateService.instant('FLIGHT.SEARCH.TITLE')
this.translateService.get('NAVIGATION.FLIGHTS').subscribe(...)

// Dynamic service patterns
const key = `COMMON.LANGUAGE.${language.toUpperCase()}_SELECTED`;
this.translateService.instant(key)
```

### 4. Enterprise Naming Conventions
```typescript
// SCREAMING_SNAKE_CASE patterns
const searchKey = `FLIGHT_SEARCH_${toScreamingSnakeCase(searchType)}_INITIATED`;
const accessKey = `ACCESS_RIGHTS_CONFIRMATION.INFO.${role.toUpperCase()}`;
```

### 5. Constants and Enums
```typescript
// Automatic detection of translation constants
export const NAVIGATION_KEYS = {
  FLIGHTS: 'NAVIGATION.FLIGHTS',
  HOTELS: 'NAVIGATION.HOTELS',
  CARS: 'NAVIGATION.CARS'
};

// Object literals with keys
readonly COMMON_MESSAGES = {
  LOADING: 'COMMON.LOADING.LOADING',
  SUCCESS: 'COMMON.SUCCESS.UPDATED'
};
```

### 6. Complex Function Patterns
```typescript
// Dynamic key generation with functions
private getAirlineTranslationKey(airline: string): string {
  return `AIRLINES.${airline}`;
}

// Template literals with function calls
const statusKey = `COMMON.LOADING.${section.toUpperCase()}`;
const enterpriseKey = `${keyPrefix}_${transformFunction(value)}_${suffix}`;
```

### 7. Conditional and Variable Keys
```typescript
// Conditional translations
const messageKey = isLoggedIn ? 'user.dashboard' : 'guest.welcome';

// Variable key patterns
this.translateService.instant(this.dynamicKeyVariable);
const result = this.translateService.get(this.getTranslationKey());
```

### 8. Multilingual Content
The application includes comprehensive translations for:

- **English** (`en.json`): Base language with all keys
- **Spanish** (`es.json`): Complete Spanish translations
- **French** (`fr.json`): Complete French translations

Each language file contains:
- Flight search and booking terminology
- Navigation and UI elements
- System notifications and messages
- Error handling and validation text
- Dynamic language switching confirmations

## 🌐 Language Switching Demo

Test the real-time language switching feature:

1. **Start the application**: `npm start`
2. **Open http://localhost:4200**
3. **Use the language dropdown** in the top navigation
4. **Watch all content update** immediately to the selected language
5. **See dynamic patterns** working with different languages

## 🔍 Running Analysis

### Basic Analysis
```bash
npm run check-translations
```

**Expected Output:**
```
🔍 Analyzing translations...

📊 Translation Analysis Results:
   Total translation keys: 78 (across all languages)
   Used keys: 78
   Unused keys: 0
   Missing keys: 0
   
✅ All translations are properly used!

🎯 Pattern Detection Summary:
   Static template pipes: 15+
   Static service calls: 10+
   Dynamic patterns: 7+
   Constants/Objects: 8+
   
✨ Dynamic patterns detected:
   - Template interpolation: `COMMON.LANGUAGE.${lang}`
   - Enterprise naming: `FLIGHT_SEARCH_${type}_INITIATED`
   - Function calls: getAirlineTranslationKey()
   - Variable keys: this.dynamicKey
```

### Verbose Analysis
```bash
npm run check-translations-verbose
```

Shows detailed detection of each pattern and file location.

### JSON Report
```bash
npm run check-translations-json
```

Generates a detailed JSON report perfect for CI/CD integration.

## 🎨 UI Design

The application features a clean, modern design using only:
- **🔵 Light Blue (#87CEEB)**: Headers, buttons, and accents
- **⚪ White (#ffffff)**: Backgrounds and cards
- **🔳 Gray shades**: Text, borders, and subtle sections

This demonstrates how translation tools work in real-world applications with professional UI/UX.

## 🏢 Enterprise Usage

This example demonstrates patterns commonly found in enterprise Angular applications:

- **Multiple service instances** for different translation contexts
- **Complex dynamic key generation** with business logic
- **Enterprise naming conventions** (SCREAMING_SNAKE_CASE)
- **Conditional translations** based on user roles/states
- **Constants and enums** for maintainable key management
- **Multilingual support** with proper fallbacks

## 🚀 Getting Started with Your Project

Use this example as a reference for implementing `angular-translation-checker` in your own projects:

1. **Install the checker**: `npm install -g angular-translation-checker`
2. **Copy the configuration**: Use our `i18n-checker.config.json` as a starting point
3. **Run analysis**: `ng-i18n-check` in your project root
4. **Integrate with CI/CD**: Add `--exit-on-issues` flag for build pipelines

## 💡 Tips for Best Results

- **Use consistent naming**: Follow established patterns like `SECTION.COMPONENT.ACTION`
- **Organize by features**: Group related translations together
- **Document dynamic patterns**: Comment complex dynamic key generation
- **Test language switching**: Ensure all dynamic patterns work across languages
- **Regular analysis**: Run checks before releases to catch issues early

---

**Happy translating!** 🌍✨
```typescript
// Direct translation calls
this.translateService.instant('WELCOME.TITLE')
this.translateService.get('WELCOME.MESSAGE')
```

### 2. Flexible Service Names
```typescript
// Different service injection names
this.i18nService.get('COMMON.ERROR.MESSAGE')
this.localizationService.instant('NAVIGATION.HOME')
this.textService.translate('FORMS.VALIDATION.REQUIRED')
```

### 3. Dynamic Patterns
```typescript
// Template literals and concatenation
this.translateService.instant(\`USER.PROFILE.\${userType}\`)
this.translateService.get('NOTIFICATION.' + notificationType + '.TITLE')
```

### 4. Standalone Keys
```typescript
// Keys passed as function parameters
handleError('COMMON.TOAST.ERROR.MESSAGE', errorData)
showNotification('SUCCESS.USER.CREATED')
```

### 5. Multiline Patterns
```typescript
// Keys spanning multiple lines
this.translateService.instant(
  'COMPLEX.MULTILINE.TRANSLATION.KEY'
)
```

### 6. Enterprise Patterns
```typescript
// SCREAMING_SNAKE_CASE with dynamic interpolation
\`ACCESS_RIGHTS_CONFIRMATION.INFO.\${toScreamingSnakeCase(key)}\`
```

## 🔧 Configuration Examples

The project includes different configuration scenarios:

### Basic Configuration
```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "verbose": true
}
```

### Advanced Configuration
```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "excludeDirs": ["node_modules", "dist", "coverage"],
  "ignoreKeys": ["DEBUG.*", "TEMP.*"],
  "ignoreFiles": ["**/*.spec.ts"],
  "outputFormat": "json",
  "exitOnIssues": true
}
```

## 📊 Expected Results

When you run the translation checker on this example project, you should see:

- **Used Keys**: All translation keys that are actively used in the code
- **Unused Keys**: Any keys in translation files that aren't referenced
- **Dynamic Patterns**: Detected template literal and concatenation patterns
- **Standalone Keys**: Keys passed as parameters or used in variables

## 🧪 Testing Different Scenarios

You can modify the files to test different scenarios:

1. **Add unused keys** to translation files to see them reported
2. **Comment out translation usage** to see keys become unused
3. **Add new dynamic patterns** to test pattern detection
4. **Try different service names** to verify flexible service detection

## 🛠️ Development

To contribute to this example or test new features:

1. Make changes to the source files
2. Run the translation checker to see results
3. Compare with expected behavior
4. Update documentation as needed

## 📝 Notes

- This example uses Angular 16+ with ngx-translate 15+
- All translation patterns are designed to showcase the checker's capabilities
- The project structure follows Angular best practices
- Translation files include nested structures and various key formats
