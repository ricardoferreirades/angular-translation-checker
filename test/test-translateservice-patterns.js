#!/usr/bin/env node

const { analyzeTranslations } = require('../lib/index');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing translateService.instant dynamic patterns...\n');

// Create test translation file
const testTranslations = {
  "ACCESS_RIGHTS_CONFIRMATION": {
    "INFO": {
      "EXPIRATION_DATE_TIME": "Expiration Date Time",
      "REQUESTED_BY_EMAIL": "Requested By Email", 
      "REQUESTED_BY_FULL_NAME": "Requested By Full Name",
      "REQUESTED_DATE_TIME": "Requested Date Time"
    }
  }
};

// Create test directory structure
const testDir = path.join(__dirname, 'translateservice-test');
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}
fs.mkdirSync(testDir, { recursive: true });

// Create locales directory and translation file
const localesDir = path.join(testDir, 'src', 'assets', 'i18n');
fs.mkdirSync(localesDir, { recursive: true });
fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(testTranslations, null, 2));

// Create source files with translateService usage
const srcDir = path.join(testDir, 'src', 'app');
fs.mkdirSync(srcDir, { recursive: true });

// Test file with the exact pattern from the user's code
const componentFile = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: '<div></div>'
})
export class TestComponent {
  
  private setFields(): void {
    this.fields = Object.entries(this.accessRightTrademakFields).map(([key, value]) => ({
      key: this.translateService.instant(
        \`ACCESS_RIGHTS_CONFIRMATION.INFO.\${toScreamingSnakeCase(key)}\`,
      ),
      value: value
    }));
  }
  
  // Also test translate.instant for comparison
  private setFieldsWithTranslate(): void {
    this.fields2 = Object.entries(this.accessRightTrademakFields).map(([key, value]) => ({
      key: this.translate.instant(
        \`ACCESS_RIGHTS_CONFIRMATION.INFO.\${toScreamingSnakeCase(key)}\`,
      ),
      value: value
    }));
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'test.component.ts'), componentFile);

// Run analysis
console.log('📝 Test file created with translateService.instant pattern:');
console.log('   - translateService.instant(`ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(key)}`)');
console.log('   - translate.instant(`ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(key)}`)');
console.log('');

const results = analyzeTranslations({
  localesPath: localesDir,
  srcPath: path.join(testDir, 'src'),
  verbose: true
});

console.log('\n📊 Analysis Results:');
console.log(`   Total keys: ${results.totalKeys}`);
console.log(`   Used keys: ${results.usedKeysCount}`);
console.log(`   Dynamic matched keys: ${results.dynamicMatchedKeysCount}`);
console.log(`   Unused keys: ${results.unusedKeys.length}`);

if (results.dynamicPatterns && results.dynamicPatterns.length > 0) {
  console.log('\n🔍 Dynamic patterns detected:');
  results.dynamicPatterns.forEach(pattern => console.log(`   - ${pattern}`));
}

if (results.dynamicMatchedKeys && results.dynamicMatchedKeys.length > 0) {
  console.log('\n🎯 Keys matched by dynamic patterns:');
  results.dynamicMatchedKeys.forEach(key => console.log(`   - ${key}`));
}

if (results.unusedKeys.length > 0) {
  console.log('\n🚨 Unused keys found:');
  results.unusedKeys.forEach(key => console.log(`   - ${key}`));
} else {
  console.log('\n✅ All keys properly detected via translateService.instant!');
}

// Cleanup
fs.rmSync(testDir, { recursive: true, force: true });

// Test validation
const expectedPattern = 'ACCESS_RIGHTS_CONFIRMATION.INFO.*';
const expectedKeys = [
  'ACCESS_RIGHTS_CONFIRMATION.INFO.EXPIRATION_DATE_TIME',
  'ACCESS_RIGHTS_CONFIRMATION.INFO.REQUESTED_BY_EMAIL',
  'ACCESS_RIGHTS_CONFIRMATION.INFO.REQUESTED_BY_FULL_NAME',
  'ACCESS_RIGHTS_CONFIRMATION.INFO.REQUESTED_DATE_TIME'
];

console.log('\n🔬 Test Validation:');

// Check if pattern was detected
let patternDetected = false;
if (results.dynamicPatterns && results.dynamicPatterns.includes(expectedPattern)) {
  console.log(`   ✅ Pattern detected: ${expectedPattern}`);
  patternDetected = true;
} else {
  console.log(`   ❌ Pattern missing: ${expectedPattern}`);
}

// Check if keys were matched
let keysMatched = 0;
if (results.dynamicMatchedKeys) {
  expectedKeys.forEach(key => {
    if (results.dynamicMatchedKeys.includes(key)) {
      console.log(`   ✅ Key matched: ${key}`);
      keysMatched++;
    }
  });
}

console.log(`\n📈 Test Summary:`);
console.log(`   Pattern detected: ${patternDetected ? 'Yes' : 'No'}`);
console.log(`   Keys matched: ${keysMatched}/${expectedKeys.length}`);
console.log(`   Unused keys: ${results.unusedKeys.length} (should be 0)`);

if (results.unusedKeys.length === 0 && patternDetected && keysMatched >= 4) {
  console.log('\n🎉 SUCCESS: translateService.instant patterns working correctly!');
  console.log('   The pattern translateService.instant(`ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(key)}`) is now supported!');
  process.exit(0);
} else {
  console.log('\n❌ FAILED: Some issues detected');
  process.exit(1);
}
