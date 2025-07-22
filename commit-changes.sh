#!/bin/bash

echo "🔄 Committing v1.3.0 enterprise features..."

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add v1.3.0 enterprise features - constants/enums detection and underscore patterns

- Enhanced dynamic pattern detection to support SCREAMING_SNAKE_CASE with underscores
- Added automatic detection of translation keys in constants, enums, and object literals  
- Improved regex patterns to handle function calls like toScreamingSnakeCase()
- Added comprehensive test coverage for new features
- Updated documentation with real-world enterprise examples
- Version bump to 1.3.0

Features added:
- Constants and enums detection (extractKeysFromConstants function)
- Enhanced underscore pattern support in dynamic templates
- Improved regex character classes to include underscores
- New test files: test-constants-enums.js and test-underscore-patterns.js
- Updated README.md with latest enhancements section
- Package version bumped from 1.2.0 to 1.3.0"

echo "✅ Changes committed successfully!"
echo "🚀 Ready to push to GitHub with: git push origin main"
