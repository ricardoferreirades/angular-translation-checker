# CI/CD Integration

Integrating Angular Translation Checker into your CI/CD pipeline ensures that translation issues are caught early and consistently across your development workflow. This guide covers various integration approaches and best practices.

## Quick Setup

### GitHub Actions

Create `.github/workflows/translations.yml`:

```yaml
name: Translation Check

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  translation-check:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Check translations
      run: |
        npx angular-translation-checker \
          --output missing \
          --format json \
          --exit-on-issues
```

### GitLab CI

Add to `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build

translation-check:
  stage: test
  image: node:18
  script:
    - npm ci
    - npx angular-translation-checker --output missing --exit-on-issues
  only:
    - merge_requests
    - main
    - develop
```

### Azure DevOps

Create `azure-pipelines.yml`:

```yaml
trigger:
- main
- develop

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    npm ci
    npx angular-translation-checker --output missing --exit-on-issues
  displayName: 'Check Translations'
```

### Jenkins

```groovy
pipeline {
    agent any
    
    tools {
        nodejs "Node18"
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Translation Check') {
            steps {
                sh '''
                    npx angular-translation-checker \
                      --output missing \
                      --format json \
                      --exit-on-issues
                '''
            }
        }
    }
}
```

## Configuration Strategies

### Environment-Specific Configs

**ci.config.json** - Strict validation for CI:
```json
{
  "srcPath": "./src",
  "translationsPath": "./src/assets/i18n",
  "defaultLanguage": "en",
  "languages": ["en", "es", "fr", "de"],
  "outputSections": ["missing"],
  "exitOnIssues": true,
  "maxMissing": 0,
  "format": "json"
}
```

**dev.config.json** - Lenient for development:
```json
{
  "srcPath": "./src",
  "translationsPath": "./src/assets/i18n",
  "defaultLanguage": "en",  
  "languages": ["en", "es", "fr", "de"],
  "outputSections": ["summary", "missing", "unused"],
  "exitOnIssues": false,
  "maxMissing": 5,
  "format": "console"
}
```

### Multi-Stage Pipeline

```bash
# Stage 1: Quick check (PR validation)
ng-i18n-check --config ci-quick.json --output missing --exit-on-issues

# Stage 2: Comprehensive check (main branch)
ng-i18n-check --config ci-full.json --output summary,missing,unused

# Stage 3: Cleanup report (scheduled)
ng-i18n-check --config cleanup.json --output unused --format csv > unused-keys.csv
```

## Integration Patterns

### Pre-commit Hooks

Using [husky](https://github.com/typicode/husky):

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "ng-i18n-check --output missing --exit-on-issues"
    }
  }
}
```

### npm Scripts Integration

Add to `package.json`:

```json
{
  "scripts": {
    "translations:check": "ng-i18n-check --output summary",
    "translations:validate": "ng-i18n-check --output missing --exit-on-issues",
    "translations:cleanup": "ng-i18n-check --output unused --format csv",
    "test:translations": "ng-i18n-check --config ci.config.json"
  }
}
```

### Docker Integration

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Run translation check
RUN npx angular-translation-checker --config ci.config.json --exit-on-issues

# Continue with build...
RUN npm run build
```

## Advanced Scenarios

### Multi-Project Monorepo

```yaml
# GitHub Actions for monorepo
name: Translation Check - All Projects

on: [push, pull_request]

jobs:
  translation-check:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: [web-app, mobile-app, admin-panel]
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Check ${{ matrix.project }} translations
      run: |
        npx angular-translation-checker \
          --config projects/${{ matrix.project }}/translation.config.json \
          --exit-on-issues
```

### Progressive Translation Validation

Allow translation debt but prevent it from growing:

```json
{
  "maxMissing": 10,
  "maxUnused": 50,
  "exitOnIssues": true,
  "progressiveValidation": true
}
```

```bash
# Store current counts
ng-i18n-check --format json > baseline.json

# Compare against baseline in CI
ng-i18n-check --format json --compare-baseline baseline.json --exit-on-regression
```

### Parallel Language Validation

```yaml
# Check each language independently
jobs:
  translation-check:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        language: [en, es, fr, de, ja]
    
    steps:
    - name: Check ${{ matrix.language }} translations
      run: |
        npx angular-translation-checker \
          --config configs/${{ matrix.language }}.config.json \
          --exit-on-issues
```

## Reporting and Notifications

### Slack Integration

```bash
#!/bin/bash
# CI script with Slack notification

RESULT=$(ng-i18n-check --format json --output missing)
MISSING_COUNT=$(echo $RESULT | jq '.summary.missingKeys')

if [ $MISSING_COUNT -gt 0 ]; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"Translation Check: $MISSING_COUNT missing keys found\"}" \
    $SLACK_WEBHOOK_URL
fi
```

### Email Reports

```yaml
# GitHub Actions with email
- name: Send Translation Report
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Translation Check Failed
    body: |
      Translation validation failed for ${{ github.repository }}
      
      Branch: ${{ github.ref }}
      Commit: ${{ github.sha }}
      
      Please check the CI logs for details.
```

### Teams Integration

```powershell
# PowerShell script for Teams
$result = ng-i18n-check --format json --output summary | ConvertFrom-Json
$message = @{
    "@type" = "MessageCard"
    summary = "Translation Check Results"
    text = "Missing: $($result.summary.missingKeys), Unused: $($result.summary.unusedKeys)"
}

Invoke-RestMethod -Uri $env:TEAMS_WEBHOOK_URL -Method Post -Body ($message | ConvertTo-Json) -ContentType 'application/json'
```

## Quality Gates

### Branch Protection Rules

Set up branch protection that requires translation validation:

```yaml
# .github/workflows/required-checks.yml
name: Required Checks

on:
  pull_request:
    branches: [ main ]

jobs:
  translation-validation:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Validate translations
      run: ng-i18n-check --output missing --exit-on-issues
```

### Deployment Gates

```yaml
# Only deploy if translations are complete
deploy:
  needs: translation-check
  if: success()
  runs-on: ubuntu-latest
  steps:
  - name: Deploy to production
    run: npm run deploy:prod
```

### SonarQube Integration

```yaml
# Generate SonarQube-compatible report
- name: Generate Translation Report
  run: |
    ng-i18n-check --format sonar > translation-issues.json
    
- name: SonarQube Scan
  uses: sonarqube-quality-gate-action@master
  with:
    scanMetadataReportFile: translation-issues.json
```

## Performance Optimization

### Caching

```yaml
# Cache node_modules and translation analysis
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      .translation-cache
    key: ${{ runner.os }}-translations-${{ hashFiles('**/package-lock.json', 'src/**/*.ts', 'src/assets/i18n/*.json') }}
```

### Incremental Checks

```bash
# Only check changed files
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD | grep -E '\.(ts|html)$')
if [ ! -z "$CHANGED_FILES" ]; then
  ng-i18n-check --files $CHANGED_FILES --exit-on-issues
fi
```

### Parallel Processing

```yaml
# Split large projects
jobs:
  translation-check-modules:
    strategy:
      matrix:
        module: [core, shared, feature-a, feature-b]
    steps:
    - name: Check ${{ matrix.module }}
      run: ng-i18n-check --src-path src/app/${{ matrix.module }} --exit-on-issues
```

## Troubleshooting CI Issues

### Common Problems

1. **Exit Code Issues**
   ```bash
   # Ensure proper exit handling
   ng-i18n-check --exit-on-issues || exit 1
   ```

2. **Path Resolution**
   ```bash
   # Use absolute paths in CI
   ng-i18n-check --src-path $PWD/src --translations-path $PWD/src/assets/i18n
   ```

3. **Memory Issues**
   ```bash
   # Increase Node.js memory for large projects
   node --max-old-space-size=4096 node_modules/.bin/ng-i18n-check
   ```

### Debug Mode

```bash
# Enable debug output in CI
DEBUG=translation-checker ng-i18n-check --output missing --exit-on-issues
```

## Best Practices

1. **Fail Fast**: Use `--exit-on-issues` for critical validations
2. **Separate Concerns**: Different configs for different pipeline stages
3. **Cache Results**: Cache dependencies and intermediate results
4. **Monitor Trends**: Track translation debt over time
5. **Clear Feedback**: Provide actionable error messages
6. **Gradual Adoption**: Start with warnings, progress to failures

## Example Configurations

### Starter Configuration
```json
{
  "outputSections": ["missing"],
  "exitOnIssues": true,
  "maxMissing": 0
}
```

### Enterprise Configuration
```json
{
  "outputSections": ["summary", "missing", "unused"],
  "exitOnIssues": true,
  "maxMissing": 0,
  "maxUnused": 20,
  "format": "json",
  "reportPath": "./reports/translations.json"
}
```

### Multi-Environment
```json
{
  "environments": {
    "ci": {
      "exitOnIssues": true,
      "maxMissing": 0
    },
    "dev": {
      "exitOnIssues": false,
      "maxMissing": 10
    }
  }
}
```

By integrating Angular Translation Checker into your CI/CD pipeline, you ensure consistent translation quality and catch issues before they reach production. Choose the approach that best fits your workflow and gradually enhance your setup as your project grows.

Need help with specific CI/CD platforms? Check our [examples](/examples/ci-cd) or [troubleshooting guide](/guide/troubleshooting).
