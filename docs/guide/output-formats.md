# Output Formats

Angular Translation Checker supports multiple output formats to integrate seamlessly with different tools and workflows. Whether you need human-readable console output, structured JSON for processing, or CSV for spreadsheet analysis, we've got you covered.

## Available Formats

- **Console** - Human-readable terminal output (default)
- **JSON** - Structured data for programmatic processing
- **CSV** - Spreadsheet-compatible format for analysis

## Console Format

The default format provides clean, readable output perfect for development and manual review.

### Basic Usage

```bash
ng-i18n-check --format console
# or simply
ng-i18n-check
```

### Console Output Structure

```
Angular Translation Checker - Project Analysis
============================================

Translation Summary:
  Total Keys: 156
  Used Keys: 142 (91.0%)
  Unused Keys: 14 (9.0%)
  Missing Keys: 3 (2.1%)
  Languages: en, es, fr, de

Missing Translation Keys:
  • user.profile.bio
  • settings.notifications.email
  • errors.validation.custom

Unused Translation Keys:
  • debug.old.feature
  • temp.backup.data
  • legacy.component.title
  
Dynamic Patterns Detected:
  Pattern: errors.${errorType}
    Files: src/services/error.service.ts:45
    Confidence: 92%
```

### Console Customization

```bash
# Show only specific sections
ng-i18n-check --format console --output summary,missing

# Colored output (default in terminals)
ng-i18n-check --format console --color

# No colors for log files
ng-i18n-check --format console --no-color
```

## JSON Format

Perfect for CI/CD integration, automated processing, and data analysis.

### Basic Usage

```bash
ng-i18n-check --format json
ng-i18n-check --format json > report.json
```

### JSON Structure

```json
{
  "metadata": {
    "version": "1.3.5",
    "timestamp": "2025-01-24T10:30:00.000Z",
    "project": "my-angular-app",
    "configFile": "./translation.config.json"
  },
  "summary": {
    "totalKeys": 156,
    "usedKeys": 142,
    "unusedKeys": 14,
    "missingKeys": 3,
    "languages": ["en", "es", "fr", "de"],
    "coverage": 91.0
  },
  "usedKeys": [
    "common.buttons.save",
    "common.buttons.cancel",
    "user.profile.name"
  ],
  "unusedKeys": [
    "debug.old.feature",
    "temp.backup.data",
    "legacy.component.title"
  ],
  "missingKeys": {
    "en": [],
    "es": ["user.profile.bio"],
    "fr": ["user.profile.bio", "settings.notifications.email"],
    "de": ["errors.validation.custom"]
  },
  "translationKeys": {
    "en": ["common.buttons.save", "user.profile.name"],
    "es": ["common.buttons.save", "user.profile.name"],
    "fr": ["common.buttons.save"],
    "de": ["common.buttons.save", "user.profile.name"]
  },
  "dynamicPatterns": [
    {
      "pattern": "errors.${errorType}",
      "locations": ["src/services/error.service.ts:45"],
      "confidence": 0.92,
      "possibleKeys": ["errors.validation", "errors.network", "errors.auth"]
    }
  ],
  "ignoredKeys": [
    "debug.*",
    "test.*"
  ],
  "config": {
    "srcPath": "./src",
    "translationsPath": "./src/assets/i18n",
    "outputSections": ["summary", "missing", "unused"]
  }
}
```

### JSON Processing Examples

#### Node.js Processing
```javascript
const fs = require('fs');
const { execSync } = require('child_process');

// Generate and parse report
const output = execSync('ng-i18n-check --format json', { encoding: 'utf8' });
const report = JSON.parse(output);

// Process results
if (report.summary.missingKeys > 0) {
  console.log(`Found ${report.summary.missingKeys} missing keys`);
  process.exit(1);
}

console.log(`Translation coverage: ${report.summary.coverage}%`);
```

#### Python Processing
```python
import json
import subprocess

# Run translation checker
result = subprocess.run(['ng-i18n-check', '--format', 'json'], 
                       capture_output=True, text=True)
report = json.loads(result.stdout)

# Generate coverage report
coverage = report['summary']['coverage']
missing_count = report['summary']['missingKeys']

print(f"Coverage: {coverage}%")
if missing_count > 0:
    print(f"Missing keys: {missing_count}")
    for lang, keys in report['missingKeys'].items():
        if keys:
            print(f"  {lang}: {', '.join(keys)}")
```

#### jq Processing
```bash
# Extract just missing keys
ng-i18n-check --format json | jq '.missingKeys'

# Get coverage percentage
ng-i18n-check --format json | jq '.summary.coverage'

# List all unused keys
ng-i18n-check --format json | jq -r '.unusedKeys[]'

# Find languages with missing keys
ng-i18n-check --format json | jq -r '.missingKeys | to_entries[] | select(.value | length > 0) | .key'
```

## CSV Format

Ideal for spreadsheet analysis, reporting, and data visualization.

### Basic Usage

```bash
ng-i18n-check --format csv
ng-i18n-check --format csv > report.csv
```

### CSV Structure

```csv
Type,Key,Language,Status,File,Line,Pattern
summary,total_keys,,156,,,
summary,used_keys,,142,,,
summary,unused_keys,,14,,,
summary,missing_keys,,3,,,
summary,coverage,,91.0,,,
used,common.buttons.save,en,found,src/components/form.component.ts,25,
used,common.buttons.save,es,found,src/components/form.component.ts,25,
unused,debug.old.feature,en,unused,,,
unused,temp.backup.data,en,unused,,,
missing,user.profile.bio,es,missing,src/components/profile.component.ts,45,
missing,settings.notifications.email,fr,missing,src/pages/settings.page.ts,78,
dynamic,errors.${errorType},*,pattern,src/services/error.service.ts,45,errors.${errorType}
ignored,debug.*,*,ignored,,,debug.*
```

### CSV Processing Examples

#### Excel/Google Sheets
Open the CSV file directly in Excel or Google Sheets for:
- Pivot tables for language coverage analysis
- Charts showing translation completion by module
- Filtering unused keys by creation date
- Sorting missing keys by priority

#### Python pandas
```python
import pandas as pd
import subprocess

# Generate CSV report
result = subprocess.run(['ng-i18n-check', '--format', 'csv'], 
                       capture_output=True, text=True)
df = pd.read_csv(pd.StringIO(result.stdout))

# Analyze by type
summary = df[df['Type'] == 'summary']
missing = df[df['Type'] == 'missing']
unused = df[df['Type'] == 'unused']

# Coverage by language
coverage_by_lang = missing.groupby('Language').size()
print(coverage_by_lang)

# Most problematic files
problem_files = missing.groupby('File').size().sort_values(ascending=False)
print(problem_files.head())
```

#### R Analysis
```r
library(readr)
library(dplyr)

# Read CSV report
report <- read_csv(pipe("ng-i18n-check --format csv"))

# Summary statistics
summary_stats <- report %>%
  filter(Type == "summary") %>%
  select(Key, Status) %>%
  mutate(Value = as.numeric(Status))

# Missing keys by language
missing_by_lang <- report %>%
  filter(Type == "missing") %>%
  count(Language, sort = TRUE)

# Plot coverage
library(ggplot2)
ggplot(missing_by_lang, aes(x = Language, y = n)) +
  geom_bar(stat = "identity") +
  labs(title = "Missing Keys by Language", y = "Count")
```

## Format-Specific Options

### Console Options

```bash
# Disable colors
ng-i18n-check --format console --no-color

# Compact output
ng-i18n-check --format console --compact

# Verbose details
ng-i18n-check --format console --verbose
```

### JSON Options

```bash
# Pretty-printed JSON
ng-i18n-check --format json --pretty

# Minified JSON
ng-i18n-check --format json --minify

# Include metadata
ng-i18n-check --format json --include-metadata
```

### CSV Options

```bash
# Custom delimiter
ng-i18n-check --format csv --delimiter ";"

# Include headers
ng-i18n-check --format csv --headers

# Escape special characters
ng-i18n-check --format csv --escape-quotes
```

## Integration Examples

### CI/CD Integration

```yaml
# GitHub Actions
- name: Generate Translation Report
  run: |
    ng-i18n-check --format json > translation-report.json
    ng-i18n-check --format csv > translation-report.csv

- name: Upload Reports
  uses: actions/upload-artifact@v3
  with:
    name: translation-reports
    path: |
      translation-report.json
      translation-report.csv
```

### Monitoring Integration

```bash
#!/bin/bash
# Send metrics to monitoring system

REPORT=$(ng-i18n-check --format json)
COVERAGE=$(echo $REPORT | jq '.summary.coverage')
MISSING=$(echo $REPORT | jq '.summary.missingKeys')

# Send to monitoring
curl -X POST http://monitoring.example.com/metrics \
  -d "translation.coverage=${COVERAGE}" \
  -d "translation.missing=${MISSING}"
```

### Automated Reporting

```javascript
const nodemailer = require('nodemailer');
const { execSync } = require('child_process');

// Generate report
const jsonReport = execSync('ng-i18n-check --format json', { encoding: 'utf8' });
const csvReport = execSync('ng-i18n-check --format csv', { encoding: 'utf8' });

// Email report
const transporter = nodemailer.createTransporter(/* config */);

transporter.sendMail({
  to: 'team@example.com',
  subject: 'Weekly Translation Report',
  text: 'Please find attached translation reports.',
  attachments: [
    { filename: 'report.json', content: jsonReport },
    { filename: 'report.csv', content: csvReport }
  ]
});
```

## Custom Format Processing

### Converting Between Formats

```bash
# JSON to CSV conversion
ng-i18n-check --format json | jq -r '
  .unusedKeys[] as $key |
  ["unused", $key, "", "", "", "", ""] |
  @csv
'

# CSV to JSON conversion (using miller)
ng-i18n-check --format csv | mlr --csv --jsonl cat
```

### Creating Custom Reports

```javascript
// Custom HTML report generator
const fs = require('fs');
const { execSync } = require('child_process');

const report = JSON.parse(execSync('ng-i18n-check --format json', { encoding: 'utf8' }));

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Translation Report</title>
  <style>
    body { font-family: Arial, sans-serif; }
    .summary { background: #f0f0f0; padding: 20px; margin: 20px 0; }
    .missing { color: red; }
    .unused { color: orange; }
  </style>
</head>
<body>
  <h1>Translation Report</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Coverage: ${report.summary.coverage}%</p>
    <p>Missing: ${report.summary.missingKeys}</p>
    <p>Unused: ${report.summary.unusedKeys}</p>
  </div>
  
  <div class="missing">
    <h2>Missing Keys</h2>
    <ul>
      ${Object.entries(report.missingKeys)
        .flatMap(([lang, keys]) => keys.map(key => `<li>${key} (${lang})</li>`))
        .join('')}
    </ul>
  </div>
</body>
</html>
`;

fs.writeFileSync('translation-report.html', html);
```

## Best Practices

### Format Selection

- **Console**: Development, manual review, debugging
- **JSON**: CI/CD, automation, programmatic processing
- **CSV**: Reports, analysis, stakeholder communication

### Performance Considerations

```bash
# Large projects - stream output
ng-i18n-check --format json --stream > large-report.json

# Filtering for performance
ng-i18n-check --format csv --output summary,missing > quick-report.csv
```

### Error Handling

```bash
# Robust scripting
if ng-i18n-check --format json > report.json 2>error.log; then
  echo "Report generated successfully"
else
  echo "Error generating report:"
  cat error.log
  exit 1
fi
```

Each format serves different purposes in your translation workflow. Choose the format that best fits your specific use case, and don't hesitate to use multiple formats for different aspects of your analysis.

Need more examples? Check our [examples section](/examples/output-formats) or [CI/CD integration guide](/guide/ci-cd).
