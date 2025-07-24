# CI/CD Integration Examples

Examples of integrating Angular Translation Checker into various CI/CD pipelines.

## GitHub Actions

```yaml
name: Translation Check

on:
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
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run translation check
      run: npx angular-translation-checker --output missing --exit-on-issues
```

## GitLab CI

```yaml
translation-check:
  stage: test
  image: node:18
  script:
    - npm ci
    - npx angular-translation-checker --output missing --exit-on-issues
  only:
    - merge_requests
```

## Azure DevOps

```yaml
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
    
- script: |
    npm ci
    npx angular-translation-checker --output missing --exit-on-issues
  displayName: 'Translation Check'
```

For more CI/CD details, see the [CI/CD Integration Guide](/guide/ci-cd).
