# Basic Usage Examples

This section provides practical examples for common day-to-day usage of Angular Translation Checker. These examples cover the most frequent scenarios developers encounter when working with translations.

## Quick Start Examples

### 1. Basic Health Check

Get a quick overview of your translation status:

```bash
ng-i18n-check --output summary
```

**Output:**
```
Translation Summary:
  Total Keys: 156
  Used Keys: 142 (91.0%)
  Unused Keys: 14 (9.0%)
  Missing Keys: 3 (2.1%)
  Languages: en, es, fr, de
  Coverage: 91.0%
```

**When to use**: Daily development check, quick project assessment

### 2. Find Missing Translations

Identify keys that need translation:

```bash
ng-i18n-check --output missing
```

**Output:**
```
Missing Translation Keys:
  Spanish (es):
    • profile.bio.placeholder
    • settings.advanced.title
  
  French (fr):
    • profile.bio.placeholder
    • notifications.email.subject
```

**When to use**: Before release, during translation review

### 3. Find Unused Translations

Discover cleanup opportunities:

```bash
ng-i18n-check --output unused
```

**Output:**
```
Unused Translation Keys:
  • debug.old.message
  • features.deprecated.title
  • temp.backup.label
```

**When to use**: Code cleanup, file size optimization

## Development Workflow Examples

### 4. Pre-commit Validation

Ensure translations are complete before committing:

```bash
ng-i18n-check --output missing --exit-on-issues
```

Add to your `package.json`:
```json
{
  "scripts": {
    "pre-commit": "ng-i18n-check --output missing --exit-on-issues"
  }
}
```

**When to use**: Git hooks, automated quality checks

### 5. Development Dashboard

Show relevant information during development:

```bash
ng-i18n-check --output summary,missing,unused
```

**Output:**
```
Translation Summary:
  Total Keys: 156
  Used Keys: 142 (91.0%)
  Unused Keys: 14 (9.0%)
  Missing Keys: 3 (2.1%)
  Languages: en, es, fr, de
  Coverage: 91.0%

Missing Translation Keys:
  Spanish (es):
    • profile.bio.placeholder

Unused Translation Keys:
  • debug.old.message
  • temp.backup.label
```

**When to use**: Daily development, comprehensive review

### 6. Focus on Specific Issues

Check only what you're working on:

```bash
# Only missing keys
ng-i18n-check --output missing

# Only unused keys for cleanup
ng-i18n-check --output unused

# Only summary for quick status
ng-i18n-check --output summary
```

**When to use**: Focused problem-solving, specific tasks

## Configuration Examples

### 7. Custom Configuration

Create a `translation.config.json`:

```json
{
  "srcPath": "./src",
  "translationsPath": "./src/assets/i18n",
  "defaultLanguage": "en",
  "languages": ["en", "es", "fr", "de"],
  "outputSections": ["summary", "missing"],
  "ignoreKeys": ["debug.*", "test.*"]
}
```

Use it:
```bash
ng-i18n-check --config translation.config.json
```

**When to use**: Team consistency, complex projects

### 8. Project-Specific Settings

Different settings for different projects:

**Frontend config (`frontend.config.json`)**:
```json
{
  "srcPath": "./apps/frontend/src",
  "translationsPath": "./apps/frontend/src/assets/i18n",
  "languages": ["en", "es", "fr"],
  "outputSections": ["summary", "missing", "unused"]
}
```

**Admin config (`admin.config.json`)**:
```json
{
  "srcPath": "./apps/admin/src", 
  "translationsPath": "./apps/admin/src/assets/i18n",
  "languages": ["en"],
  "outputSections": ["summary", "missing"]
}
```

```bash
ng-i18n-check --config frontend.config.json
ng-i18n-check --config admin.config.json
```

**When to use**: Monorepos, multiple applications

## Output Format Examples

### 9. JSON for Processing

Generate structured data:

```bash
ng-i18n-check --format json > report.json
```

Process with `jq`:
```bash
# Get coverage percentage
ng-i18n-check --format json | jq '.summary.coverage'

# List missing keys for Spanish
ng-i18n-check --format json | jq '.missingKeys.es[]'

# Count unused keys
ng-i18n-check --format json | jq '.unusedKeys | length'
```

**When to use**: Automation, data processing, reporting

### 10. CSV for Analysis

Generate spreadsheet-compatible data:

```bash
ng-i18n-check --format csv > analysis.csv
```

Open in Excel/Google Sheets for:
- Filtering by language
- Sorting by key type
- Creating pivot tables
- Generating charts

**When to use**: Stakeholder reports, detailed analysis

### 11. Console for Humans

Default readable format:

```bash
ng-i18n-check --format console
# or simply
ng-i18n-check
```

**When to use**: Development, manual review, debugging

## Package.json Integration

### 12. Common Script Patterns

Add to your `package.json`:

```json
{
  "scripts": {
    "translations:check": "ng-i18n-check --output summary",
    "translations:missing": "ng-i18n-check --output missing",
    "translations:unused": "ng-i18n-check --output unused",
    "translations:validate": "ng-i18n-check --output missing --exit-on-issues",
    "translations:report": "ng-i18n-check --format json > reports/translations.json",
    "translations:cleanup": "ng-i18n-check --output unused --format csv > cleanup.csv"
  }
}
```

Usage:
```bash
npm run translations:check      # Quick health check
npm run translations:missing    # Find missing translations
npm run translations:unused     # Find cleanup opportunities
npm run translations:validate   # Strict validation (fails on issues)
npm run translations:report     # Generate JSON report
npm run translations:cleanup    # Generate cleanup CSV
```

**When to use**: Team workflows, CI/CD integration

## Real-World Scenarios

### 13. Before Release Checklist

```bash
#!/bin/bash
echo "Checking translations before release..."

# 1. Ensure no missing translations
if ng-i18n-check --output missing --exit-on-issues --quiet; then
  echo "No missing translations"
else
  echo "Missing translations found - please fix before release"
  exit 1
fi

# 2. Check coverage
COVERAGE=$(ng-i18n-check --format json --quiet | jq '.summary.coverage')
if (( $(echo "$COVERAGE >= 95" | bc -l) )); then
  echo "Translation coverage: ${COVERAGE}%"
else
  echo "Translation coverage below 95%: ${COVERAGE}%"
fi

# 3. Generate release report
ng-i18n-check --format json > release-translations.json
echo "Translation report generated"
```

**When to use**: Release preparation, quality gates

### 14. New Developer Onboarding

Create a simple check for new team members:

```bash
# Add to README.md
echo "## Translation Health Check"
echo "Run this to check your translation setup:"
echo ""
echo "\`\`\`bash"
echo "npm run translations:check"
echo "\`\`\`"
echo ""
echo "Expected output should show high coverage (>90%) with minimal missing keys."
```

**When to use**: Team onboarding, documentation

### 15. Feature Development Workflow

When working on a new feature:

```bash
# 1. Start development
ng-i18n-check --output summary

# 2. Add translation keys as you code
# ... development work ...

# 3. Check what's missing before review
ng-i18n-check --output missing

# 4. Add missing translations
# ... add translations ...

# 5. Final validation
ng-i18n-check --output missing --exit-on-issues
```

**When to use**: Feature development, code reviews

## Debugging Examples

### 16. Investigate Dynamic Keys

When you have dynamic translation keys:

```bash
ng-i18n-check --output dynamicPatterns
```

**Output:**
```
Dynamic Patterns Detected:
  Pattern: errors.${errorType}
    Files: src/services/error.service.ts:45
    Confidence: 92%
    
  Pattern: user.${status}.message
    Files: src/components/user.component.ts:28
    Confidence: 87%
```

**When to use**: Understanding complex key usage, debugging missing keys

### 17. Check Ignore Patterns

Verify what's being ignored:

```bash
ng-i18n-check --output ignored
```

**Output:**
```
Ignored Keys:
  Pattern: debug.*
    Count: 5 keys
    Examples: debug.log, debug.info, debug.error
    
  Pattern: test.*
    Count: 12 keys
    Examples: test.mock.data, test.fixture.user
```

**When to use**: Debugging ignore rules, verifying configuration

### 18. Comprehensive Analysis

When you need the full picture:

```bash
ng-i18n-check --output summary,missing,unused,dynamicPatterns,ignored --verbose
```

**When to use**: Deep investigation, comprehensive audit

## Performance Examples

### 19. Quick Check for Large Projects

For faster results on large codebases:

```bash
ng-i18n-check --output summary --quiet
```

**When to use**: Large projects, frequent checks

### 20. Targeted Analysis

Check specific directories:

```bash
ng-i18n-check --src-path ./src/app/features/user --output missing
```

**When to use**: Feature-specific analysis, debugging specific modules

## Error Handling Examples

### 21. Graceful Script Handling

```bash
#!/bin/bash
if ng-i18n-check --output missing --exit-on-issues --quiet; then
  echo "All translations complete"
  npm run build
else
  echo "Missing translations - build cancelled"
  echo "Run 'npm run translations:missing' to see details"
  exit 1
fi
```

### 22. Fallback Strategies

```bash
#!/bin/bash
# Try strict check first, fall back to lenient
ng-i18n-check --output missing --exit-on-issues --quiet || {
  echo "Issues found, showing summary:"
  ng-i18n-check --output summary
}
```

These examples cover the most common use cases you'll encounter when using Angular Translation Checker. Start with the basic examples and gradually incorporate more advanced patterns as your needs grow.

For more complex scenarios, see our [configuration guide](/guide/configuration) or [API reference](/api/).
