#!/usr/bin/env node

const { analyzeTranslations } = require('../lib/index');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Ignore Keys Functionality...\n');

// Create test translation file with various key patterns
const testTranslations = {
  "user": {
    "name": "User Name",
    "email": "Email",
    "profile": {
      "settings": "Profile Settings"
    }
  },
  "debug": {
    "api": {
      "request": "API Request Debug",
      "response": "API Response Debug"
    },
    "performance": "Performance Debug"
  },
  "temp": {
    "new_feature": "New Feature (Temp)",
    "experimental": "Experimental Feature"
  },
  "admin": {
    "dashboard": "Admin Dashboard",
    "deprecated": {
      "old_panel": "Old Admin Panel"
    }
  },
  "internal": {
    "dev_tools": "Development Tools",
    "system": {
      "logs": "System Logs"
    }
  },
  "TEST_CONSTANT": "Test Constant",
  "ANOTHER_CONST": "Another Constant"
};

// Create test directory structure
const testDir = path.join(__dirname, 'ignore-test');
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

// Create test source file that uses some keys
const testComponent = `
export class TestComponent {
  constructor(private translate: TranslateService) {}
  
  getUserName() {
    return this.translate.instant('user.name');
  }
  
  getEmail() {
    return this.translate.instant('user.email');
  }
  
  getDashboard() {
    return this.translate.instant('admin.dashboard');
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'test.component.ts'), testComponent);

// Test configuration with ignore patterns
const testConfig = {
  localesPath: i18nDir,
  srcPath: srcDir,
  verbose: true,
  ignoreKeys: [
    'temp.new_feature'
  ],
  ignorePatterns: [
    'debug.**',
    'temp.experimental',
    'admin.deprecated.*',
    'internal.**'
  ],
  ignoreRegex: [
    '^[A-Z_]+$'
  ]
};

try {
  console.log('📋 Test Configuration:');
  console.log('   Ignore Keys:', testConfig.ignoreKeys);
  console.log('   Ignore Patterns:', testConfig.ignorePatterns);
  console.log('   Ignore Regex:', testConfig.ignoreRegex);
  console.log();

  const results = analyzeTranslations(testConfig);
  
  console.log('📊 Test Results:');
  console.log(`   Total keys: ${results.totalKeys}`);
  console.log(`   Used keys: ${results.usedKeysCount}`);
  console.log(`   Ignored keys: ${results.ignoredKeysCount}`);
  console.log(`   Unused keys: ${results.unusedKeys.length}`);
  console.log();
  
  console.log('🚫 Ignored Keys:');
  results.ignoredKeys.forEach(key => console.log(`   - ${key}`));
  console.log();
  
  console.log('🚨 Unused Keys (should not include ignored ones):');
  results.unusedKeys.forEach(key => console.log(`   - ${key}`));
  console.log();
  
  // Verification
  const expectedIgnored = [
    'debug.api.request',
    'debug.api.response', 
    'debug.performance',
    'temp.new_feature',
    'temp.experimental',
    'admin.deprecated.old_panel',
    'internal.dev_tools',
    'internal.system.logs',
    'TEST_CONSTANT',
    'ANOTHER_CONST'
  ];
  
  const actualIgnored = results.ignoredKeys;
  const missingIgnored = expectedIgnored.filter(key => !actualIgnored.includes(key));
  const extraIgnored = actualIgnored.filter(key => !expectedIgnored.includes(key));
  
  if (missingIgnored.length === 0 && extraIgnored.length === 0) {
    console.log('✅ PASS: All expected keys were ignored correctly!');
  } else {
    console.log('❌ FAIL: Ignore functionality has issues:');
    if (missingIgnored.length > 0) {
      console.log('   Missing ignored keys:', missingIgnored);
    }
    if (extraIgnored.length > 0) {
      console.log('   Unexpected ignored keys:', extraIgnored);
    }
  }
  
  // Check that ignored keys are NOT in unused keys
  const ignoredInUnused = results.unusedKeys.filter(key => actualIgnored.includes(key));
  if (ignoredInUnused.length === 0) {
    console.log('✅ PASS: No ignored keys appear in unused keys list!');
  } else {
    console.log('❌ FAIL: Some ignored keys still appear in unused keys:', ignoredInUnused);
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
