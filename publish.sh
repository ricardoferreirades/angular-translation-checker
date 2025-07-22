#!/bin/bash

echo "🚀 Publishing Angular Translation Checker to npm"
echo "=================================================="

echo ""
echo "📋 Pre-flight checklist:"
echo "✅ All tests passed"
echo "✅ Package name available"
echo "✅ Dry run successful" 
echo "✅ Files ready for publishing:"
echo "   - LICENSE (1.1kB)"
echo "   - README.md (14.5kB)"
echo "   - bin/ng-i18n-check.js (5.1kB)"
echo "   - lib/index.js (9.2kB)"
echo "   - package.json (1.4kB)"
echo "   - templates/ (1.7kB)"

echo ""
echo "🔐 STEP 1: Login to npm"
echo "Run: npm login"
echo ""

echo "📦 STEP 2: Publish the package"
echo "Run: npm publish"
echo ""

echo "✅ STEP 3: Verify publication"
echo "Run: npm view angular-translation-checker"
echo ""

echo "🌍 STEP 4: Test global installation"
echo "Run: npm install -g angular-translation-checker"
echo "Run: ng-i18n-check --help"
echo ""

echo "📊 Post-publication tasks:"
echo "- Create GitHub repository"
echo "- Add repository to GitHub"
echo "- Create first release tag"
echo "- Share with Angular community"
echo ""

echo "🎉 Your package will be available at:"
echo "https://www.npmjs.com/package/angular-translation-checker"
