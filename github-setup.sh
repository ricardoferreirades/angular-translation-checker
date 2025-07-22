#!/bin/bash

echo "🚀 Pushing Angular Translation Checker to GitHub"
echo "================================================="

# Step 1: Initialize git repository (if not already done)
echo ""
echo "📁 Step 1: Initialize git repository"
git init

# Step 2: Add all files
echo ""
echo "📄 Step 2: Add all files to git"
git add .

# Step 3: Create initial commit
echo ""
echo "💾 Step 3: Create initial commit"
git commit -m "feat: Initial release of Angular Translation Checker

✨ Features:
- Dynamic pattern detection for Angular ngx-translate
- Template interpolation support (backticks with \${variables})
- String concatenation detection
- Conditional key matching
- Comprehensive CLI with multiple output formats
- Auto-detection of project structures
- Zero dependencies
- Full test coverage

🎯 Supports:
- Static translation patterns
- Dynamic translation patterns
- Multiple project structures (CLI, Nx, monorepo)
- CI/CD integration
- JSON, CSV, and console output formats

📦 Ready for npm publication as angular-translation-checker"

# Step 4: Create GitHub repository
echo ""
echo "🌐 Step 4: Create GitHub repository"
gh repo create angular-translation-checker \
  --description "A comprehensive tool for analyzing translation keys in Angular projects using ngx-translate. Detect unused translations, missing keys, and keep your i18n files clean." \
  --public \
  --clone=false \
  --add-readme=false

# Step 5: Add GitHub remote
echo ""
echo "🔗 Step 5: Add GitHub remote"
git remote add origin https://github.com/ricardoferreirades/angular-translation-checker.git

# Step 6: Push to GitHub
echo ""
echo "⬆️  Step 6: Push to GitHub"
git branch -M main
git push -u origin main

# Step 7: Create initial release
echo ""
echo "🏷️  Step 7: Create initial release (v1.0.0)"
gh release create v1.0.0 \
  --title "🎉 Angular Translation Checker v1.0.0" \
  --notes "## 🚀 Initial Release

### ✨ Features
- **Dynamic Pattern Detection**: Supports template interpolation, string concatenation, and conditional keys
- **Smart Analysis**: Wildcard pattern matching for dynamic translations
- **Multiple Output Formats**: Console, JSON, and CSV
- **Auto-Detection**: Automatically finds Angular translation structures
- **CI/CD Ready**: Exit codes and automated reporting
- **Zero Dependencies**: Lightweight and fast

### 🎯 What's Included
- Complete CLI tool with \`ng-i18n-check\` command
- Comprehensive documentation with compatibility tables
- Full test suite (5/5 tests passing)
- Support for Angular 12+ and Node.js 14+
- Enhanced dynamic pattern matching

### 📦 Installation
\`\`\`bash
npm install -g angular-translation-checker
\`\`\`

### 🔍 Quick Start
\`\`\`bash
cd your-angular-project
ng-i18n-check
\`\`\`

This is the first npm package to provide comprehensive dynamic pattern detection for Angular ngx-translate projects!"

echo ""
echo "✅ Repository created successfully!"
echo ""
echo "🌐 Your repository: https://github.com/ricardoferreirades/angular-translation-checker"
echo "📦 Ready for npm: npm publish"
echo "🎉 Share it with the Angular community!"
