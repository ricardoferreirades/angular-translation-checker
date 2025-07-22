#!/usr/bin/env node

const { analyzeTranslations } = require('../lib/index');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Dynamic Pattern Matching...\n');

// Create test translation file with the edge case scenario
const testTranslations = {
  "user": {
    "profile": {
      "name": "User Name",
      "email": "Email"
    }
  },
  "country": {
    "code": {
      "1": "United States",
      "21": "Mexico",
      "33": "France",
      "44": "United Kingdom",
      "49": "Germany"
    }
  },
  "permissions": {
    "admin": {
      "description": "Administrator permissions"
    },
    "regular": {
      "description": "Regular user permissions"
    },
    "guest": {
      "description": "Guest permissions"
    }
  },
  "messages": {
    "success": {
      "saved": "Successfully saved",
      "deleted": "Successfully deleted"
    },
    "error": {
      "network": "Network error",
      "validation": "Validation error"
    }
  }
};

// Create test directory structure
const testDir = path.join(__dirname, 'dynamic-pattern-test');
const i18nDir = path.join(testDir, 'i18n');
const srcDir = path.join(testDir, 'src');

// Clean up and create directories
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}
fs.mkdirSync(testDir, { recursive: true });
fs.mkdirSync(i18nDir, { recursive: true });
fs.mkdirSync(srcDir, { recursive: true });

// Write test translation file
fs.writeFileSync(
  path.join(i18nDir, 'en.json'),
  JSON.stringify(testTranslations, null, 2)
);

// Create test component with dynamic patterns
const testComponent = `
export class TestComponent {
  constructor(private translate: TranslateService) {}
  
  // Static usage
  getUserName() {
    return this.translate.instant('user.profile.name');
  }
  
  // Dynamic pattern - template literal
  getCountryName(countryCode: string) {
    return this.translate.instant(\`country.code.\${countryCode}\`);
  }
  
  // Dynamic pattern - string concatenation
  getPermissionDescription(userRole: string) {
    return this.translate.get('permissions.' + userRole + '.description');
  }
  
  // Dynamic pattern - template literal with method call
  getMessageText(type: string, action: string) {
    return this.translate.get(\`messages.\${type}.\${action}\`);
  }
}
`;

// Create test template with dynamic patterns
const testTemplate = `
<div>
  <!-- Static usage -->
  <h1>{{ 'user.profile.email' | translate }}</h1>
  
  <!-- Dynamic pattern - template literal -->
  <p>{{ \`country.code.\${selectedCountry}\` | translate }}</p>
  
  <!-- Dynamic pattern - string concatenation -->
  <span>{{ 'permissions.' + currentRole + '.description' | translate }}</span>
  
  <!-- Dynamic pattern - more complex -->
  <div>{{ \`messages.\${messageType}.\${messageAction}\` | translate }}</div>
</div>
`;

fs.writeFileSync(path.join(srcDir, 'test.component.ts'), testComponent);
fs.writeFileSync(path.join(srcDir, 'test.component.html'), testTemplate);

// Test configuration
const testConfig = {
  localesPath: i18nDir,
  srcPath: srcDir,
  verbose: true
};

try {
  console.log('📋 Testing Edge Case: "country.code.21" used via "country.code.${countryCode}"');
  console.log();

  const results = analyzeTranslations(testConfig);
  
  console.log('📊 Test Results:');
  console.log(`   Total keys: ${results.totalKeys}`);
  console.log(`   Used keys (static): ${results.usedKeysCount}`);
  console.log(`   Used keys (dynamic): ${results.dynamicMatchedKeysCount}`);
  console.log(`   Unused keys: ${results.unusedKeys.length}`);
  console.log();
  
  console.log('🎯 Dynamic Patterns Found:');
  results.dynamicPatterns.forEach(pattern => console.log(`   - ${pattern}`));
  console.log();
  
  console.log('📍 Keys Matched by Dynamic Patterns:');
  results.dynamicMatchedKeys.forEach(key => console.log(`   - ${key}`));
  console.log();
  
  console.log('🚨 Unused Keys (should NOT include country.code.21, permissions.*.description, etc.):');
  results.unusedKeys.forEach(key => console.log(`   - ${key}`));
  console.log();
  
  // Verification
  const expectedDynamicPatterns = [
    'country.code.*',
    'permissions.*.description',
    'messages.*.*'
  ];
  
  const expectedDynamicMatches = [
    'country.code.1',
    'country.code.21',
    'country.code.33',
    'country.code.44', 
    'country.code.49',
    'permissions.admin.description',
    'permissions.regular.description',
    'permissions.guest.description',
    'messages.success.saved',
    'messages.success.deleted',
    'messages.error.network',
    'messages.error.validation'
  ];
  
  const foundPatterns = results.dynamicPatterns;
  const foundMatches = results.dynamicMatchedKeys;
  
  let success = true;
  
  // Check if key "country.code.21" is no longer in unused keys
  if (results.unusedKeys.includes('country.code.21')) {
    console.log('❌ FAIL: country.code.21 is still marked as unused!');
    success = false;
  } else {
    console.log('✅ PASS: country.code.21 is correctly detected as used!');
  }
  
  // Check if permissions keys are detected
  if (results.unusedKeys.includes('permissions.admin.description')) {
    console.log('❌ FAIL: permissions.admin.description is still marked as unused!');
    success = false;
  } else {
    console.log('✅ PASS: permissions.admin.description is correctly detected as used!');
  }
  
  // Check dynamic pattern detection
  if (foundPatterns.includes('country.code.*')) {
    console.log('✅ PASS: Dynamic pattern "country.code.*" was detected!');
  } else {
    console.log('❌ FAIL: Dynamic pattern "country.code.*" was NOT detected!');
    success = false;
  }
  
  if (foundMatches.includes('country.code.21')) {
    console.log('✅ PASS: "country.code.21" was matched by dynamic pattern!');
  } else {
    console.log('❌ FAIL: "country.code.21" was NOT matched by dynamic pattern!');
    success = false;
  }
  
  if (success) {
    console.log('\n🎉 ALL TESTS PASSED! Dynamic pattern matching is working correctly!');
  } else {
    console.log('\n❌ SOME TESTS FAILED! Dynamic pattern matching needs fixes.');
  }
  
} catch (error) {
  console.error('❌ Test failed:', error);
} finally {
  // Clean up
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
  console.log('\n🧹 Test cleanup completed!');
}
