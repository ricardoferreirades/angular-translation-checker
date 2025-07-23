#!/usr/bin/env node

/**
 * Test script to demonstrate angular-translation-checker on the example project
 * This script will install dependencies and run the translation checker
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Angular Translation Checker - Example Project Test\n');

const exampleDir = path.join(__dirname, 'example');
const rootDir = __dirname;

// Change to example directory
process.chdir(exampleDir);

console.log('📂 Working directory:', exampleDir);
console.log('📝 Running translation analysis on example project...\n');

try {
  // Check if the translation checker is available
  const checkerPath = path.join(rootDir, 'bin', 'ng-i18n-check.js');
  if (!fs.existsSync(checkerPath)) {
    console.error('❌ Translation checker not found at:', checkerPath);
    process.exit(1);
  }

  console.log('🔍 Found translation checker at:', checkerPath);
  console.log('🏃 Running analysis...\n');

  // Run the translation checker with verbose output
  const result = execSync(`node "${checkerPath}" --verbose`, {
    encoding: 'utf8',
    stdio: 'pipe'
  });

  console.log(result);
  
  console.log('\n✅ Translation analysis completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - The example project demonstrates various translation patterns');
  console.log('   - All patterns should be detected by the angular-translation-checker');
  console.log('   - Check the output above to see detected keys and patterns');
  console.log('\n🎯 Expected Results:');
  console.log('   ✓ Standard translateService.instant() and .get() calls');
  console.log('   ✓ Flexible service names (i18nService, localizationService, etc.)');
  console.log('   ✓ Dynamic patterns with template literals and concatenation');
  console.log('   ✓ Standalone keys passed as function parameters');
  console.log('   ✓ Multiline translation calls');
  console.log('   ✓ Enterprise SCREAMING_SNAKE_CASE patterns');
  console.log('\n🔧 Next Steps:');
  console.log('   1. Review the detected keys and patterns above');
  console.log('   2. Modify files in example/src/ to test different scenarios');
  console.log('   3. Re-run: npm run check-translations');
  console.log('   4. Try different output formats: npm run check-translations-json');

} catch (error) {
  console.error('❌ Error running translation checker:');
  console.error(error.message);
  
  if (error.stdout) {
    console.log('\n📤 Standard Output:');
    console.log(error.stdout);
  }
  
  if (error.stderr) {
    console.log('\n📥 Standard Error:');
    console.log(error.stderr);
  }
  
  process.exit(1);
}
