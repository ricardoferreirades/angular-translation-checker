#!/usr/bin/env node

const { analyzeTranslations } = require('../lib/index');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing flexible service name detection...\n');

// Create test translation file
const testTranslations = {
  "EMADRID": {
    "GRANT_ACCESS_RIGHTS": {
      "GRANT_REJECTED": "Grant rejected message"
    }
  },
  "COMMON": {
    "ERROR": {
      "MESSAGE": "Common error"
    }
  },
  "DYNAMIC": {
    "PATTERN": {
      "TEST": "Dynamic pattern test"
    }
  }
};

// Create test directory structure
const testDir = path.join(__dirname, 'flexible-service-test');
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}
fs.mkdirSync(testDir, { recursive: true });

// Create locales directory and translation file
const localesDir = path.join(testDir, 'src', 'assets', 'i18n');
fs.mkdirSync(localesDir, { recursive: true });
fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(testTranslations, null, 2));

// Create source files
const srcDir = path.join(testDir, 'src', 'app');
fs.mkdirSync(srcDir, { recursive: true });

// Test file with various service names
const componentFile = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: '<div></div>'
})
export class TestComponent {
  
  // Different service names - all should be detected
  testDifferentServices() {
    // Example 1: this.translateService (already worked)
    this.translateService.instant(
      'EMADRID.GRANT_ACCESS_RIGHTS.GRANT_REJECTED',
    );
    
    // Example 2: this.i18nService 
    this.i18nService.get('COMMON.ERROR.MESSAGE');
    
    // Example 3: this.localizationService
    this.localizationService.instant('DYNAMIC.PATTERN.TEST');
    
    // Example 4: Dynamic pattern with custom service
    this.myCustomService.get(\`DYNAMIC.PATTERN.\${dynamicKey}\`);
    
    // Example 5: String concatenation with custom service  
    this.textService.translate('DYNAMIC.' + 'PATTERN' + '.TEST');
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'flexible-test.ts'), componentFile);

// Run analysis
console.log('📝 Test file created with different service names:');
console.log('   - this.translateService.instant()');
console.log('   - this.i18nService.get()');
console.log('   - this.localizationService.instant()');
console.log('   - this.myCustomService.get() with dynamic pattern');
console.log('   - this.textService.translate() with concatenation');
console.log('');

const results = analyzeTranslations({
  localesPath: localesDir,
  srcPath: path.join(testDir, 'src'),
  verbose: true
});

console.log('\\n📊 Analysis Results:');
console.log(`   Total keys: ${results.totalKeys}`);
console.log(`   Used keys: ${results.usedKeysCount}`);
console.log(`   Dynamic matched keys: ${results.dynamicMatchedKeysCount}`);
console.log(`   Unused keys: ${results.unusedKeys.length}`);

if (results.dynamicPatterns && results.dynamicPatterns.length > 0) {
  console.log('\\n🔍 Dynamic patterns detected:');
  results.dynamicPatterns.forEach(pattern => console.log(`   - ${pattern}`));
}

if (results.unusedKeys.length > 0) {
  console.log('\\n🚨 Unused keys found:');
  results.unusedKeys.forEach(key => console.log(`   - ${key}`));
} else {
  console.log('\\n✅ All keys properly detected with flexible service names!');
}

// Cleanup
fs.rmSync(testDir, { recursive: true, force: true });

// Test validation
const expectedStaticKeys = [
  'EMADRID.GRANT_ACCESS_RIGHTS.GRANT_REJECTED',
  'COMMON.ERROR.MESSAGE', 
  'DYNAMIC.PATTERN.TEST'
];

const expectedDynamicPattern = 'DYNAMIC.PATTERN.*';

console.log('\\n🔬 Test Validation:');

// Check if static keys were detected
let staticKeysDetected = 0;
expectedStaticKeys.forEach(key => {
  if (results.usedKeys && results.usedKeys.includes(key)) {
    console.log(`   ✅ Static key detected: ${key}`);
    staticKeysDetected++;
  } else {
    console.log(`   ❌ Static key missing: ${key}`);
  }
});

// Check if dynamic pattern was detected
let dynamicPatternDetected = false;
if (results.dynamicPatterns && results.dynamicPatterns.includes(expectedDynamicPattern)) {
  console.log(`   ✅ Dynamic pattern detected: ${expectedDynamicPattern}`);
  dynamicPatternDetected = true;
} else {
  console.log(`   ❌ Dynamic pattern missing: ${expectedDynamicPattern}`);
}

console.log(`\\n📈 Test Summary:`);
console.log(`   Static keys detected: ${staticKeysDetected}/${expectedStaticKeys.length}`);
console.log(`   Dynamic pattern detected: ${dynamicPatternDetected ? 'Yes' : 'No'}`);
console.log(`   Unused keys: ${results.unusedKeys.length} (should be 0)`);

if (results.unusedKeys.length === 0 && staticKeysDetected >= 3 && dynamicPatternDetected) {
  console.log('\\n🎉 SUCCESS: Flexible service name detection working correctly!');
  console.log('   Any service calling .get(), .instant(), or .translate() is now supported!');
  process.exit(0);
} else {
  console.log('\\n❌ FAILED: Some issues detected');
  console.log(`   Expected 3 static keys and 1 dynamic pattern`);
  process.exit(1);
}
