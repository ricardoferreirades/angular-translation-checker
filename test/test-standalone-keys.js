#!/usr/bin/env node

const { analyzeTranslations } = require('../lib/index');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing standalone translation key detection...\n');

// Create test translation file
const testTranslations = {
  "COMMON": {
    "TOAST": {
      "ERROR": {
        "TITLE": "Error",
        "MESSAGE": {
          "ACCESS_RIGHTS": "Access rights error message"
        }
      }
    }
  }
};

// Create test directory structure
const testDir = path.join(__dirname, 'standalone-keys-test');
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

// Test file with standalone keys and variable usage
const componentFile = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: '<div></div>'
})
export class TestComponent {
  
  handleError() {
    // Scenario 1: Standalone key passed as function parameter
    handleErrorsResponse(
      error,
      this.toastMessageService,
      this.translateService,
      'COMMON.TOAST.ERROR.MESSAGE.ACCESS_RIGHTS',
    );
  }
}

/**
 * It show the toast message for each error in the list
 * @param errors the list of errors
 * @param toastMessageService the service responsible for the toast message
 * @param translateService the service responsible for the translate message
 */
export function handleErrorsResponse(
  error: any,
  toastMessageService: any,
  translateService: any,
  generalMessageTranslationKey: string,
): void {
  if (Array.isArray(error)) {
    error.forEach((err: any) => {
      try {
        toastMessageService.showError(
          translateService.instant('COMMON.TOAST.ERROR.TITLE'),
          err.message || err.description,
        );
      } catch (error) {
        console.error('Error handling errors response:', error);
      }
    });
  } else {
    // Scenario 2: Variable key used in translateService.instant()
    toastMessageService.showError(
      translateService.instant('COMMON.TOAST.ERROR.TITLE'),
      translateService.instant(generalMessageTranslationKey),
    );
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'error-handler.ts'), componentFile);

// Run analysis
console.log('📝 Test file created with standalone key scenarios:');
console.log('   - Standalone key: "COMMON.TOAST.ERROR.MESSAGE.ACCESS_RIGHTS" as function parameter');
console.log('   - Direct usage: translateService.instant("COMMON.TOAST.ERROR.TITLE")');
console.log('   - Variable usage: translateService.instant(generalMessageTranslationKey)');
console.log('');

const results = analyzeTranslations({
  localesPath: localesDir,
  srcPath: path.join(testDir, 'src'),
  verbose: true
});

console.log('\n📊 Analysis Results:');
console.log(`   Total keys: ${results.totalKeys}`);
console.log(`   Used keys: ${results.usedKeysCount}`);
console.log(`   Unused keys: ${results.unusedKeys.length}`);

if (results.unusedKeys.length > 0) {
  console.log('\n🚨 Unused keys found:');
  results.unusedKeys.forEach(key => console.log(`   - ${key}`));
} else {
  console.log('\n✅ All keys properly detected!');
}

// Cleanup
fs.rmSync(testDir, { recursive: true, force: true });

// Test validation
const expectedKeys = [
  'COMMON.TOAST.ERROR.TITLE',
  'COMMON.TOAST.ERROR.MESSAGE.ACCESS_RIGHTS'
];

console.log('\n🔬 Test Validation:');

// Check if keys were detected
let keysDetected = 0;
expectedKeys.forEach(key => {
  if (results.usedKeys && results.usedKeys.includes(key)) {
    console.log(`   ✅ Key detected: ${key}`);
    keysDetected++;
  } else {
    console.log(`   ❌ Key missing: ${key}`);
  }
});

console.log(`\n📈 Test Summary:`);
console.log(`   Keys detected: ${keysDetected}/${expectedKeys.length}`);
console.log(`   Unused keys: ${results.unusedKeys.length} (should be 0)`);

if (results.unusedKeys.length === 0 && keysDetected >= 2) {
  console.log('\n🎉 SUCCESS: Standalone key detection working correctly!');
  console.log('   Keys passed as function parameters and used in variables are now supported!');
  process.exit(0);
} else {
  console.log('\n❌ FAILED: Some issues detected');
  console.log(`   Expected 2 keys detected, got ${keysDetected}`);
  process.exit(1);
}
