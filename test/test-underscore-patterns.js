#!/usr/bin/env node

const { analyzeTranslations } = require('../lib/index');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Underscore Pattern Matching...\n');

// Create test translation file with underscore keys
const testTranslations = {
  "ACCESS_RIGHTS_CONFIRMATION": {
    "INFO": {
      "USER_MANAGEMENT": "User management access rights",
      "ADMIN_PANEL": "Admin panel access rights",
      "REPORT_VIEWER": "Report viewer access rights",
      "DATA_EXPORT": "Data export access rights"
    }
  },
  "API_ENDPOINTS": {
    "USER_CREATE": "Create user endpoint",
    "USER_UPDATE": "Update user endpoint",
    "USER_DELETE": "Delete user endpoint"
  },
  "ERROR_MESSAGES": {
    "VALIDATION_FAILED": "Validation failed",
    "ACCESS_DENIED": "Access denied",
    "NETWORK_ERROR": "Network error"
  }
};

// Create test directory structure
const testDir = path.join(__dirname, 'underscore-pattern-test');
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}
fs.mkdirSync(testDir, { recursive: true });

// Create locales directory and translation file
const localesDir = path.join(testDir, 'src', 'assets', 'i18n');
fs.mkdirSync(localesDir, { recursive: true });
fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(testTranslations, null, 2));

// Create source files with underscore dynamic patterns
const srcDir = path.join(testDir, 'src', 'app');
fs.mkdirSync(srcDir, { recursive: true });

// Test file 1: Template literals with function calls (the reported edge case)
const templateFile = `
export class AccessRightsComponent {
  
  getUserAccessMessage(key: string) {
    // This should match ACCESS_RIGHTS_CONFIRMATION.INFO.USER_MANAGEMENT, etc.
    return this.translate.get(\`ACCESS_RIGHTS_CONFIRMATION.INFO.\${toScreamingSnakeCase(key)}\`);
  }
  
  getApiEndpoint(action: string) {
    // This should match API_ENDPOINTS.USER_CREATE, etc.
    return this.translate.instant(\`API_ENDPOINTS.\${action.toUpperCase()}\`);
  }
}
`;

// Test file 2: HTML template with underscore patterns
const htmlTemplate = `
<div class="access-rights">
  <!-- This should match ACCESS_RIGHTS_CONFIRMATION.INFO.ADMIN_PANEL -->
  <p>{{ \`ACCESS_RIGHTS_CONFIRMATION.INFO.\${userRole}\` | translate }}</p>
  
  <!-- This should match ERROR_MESSAGES.VALIDATION_FAILED, etc. -->
  <div *ngIf="errorType">
    {{ \`ERROR_MESSAGES.\${errorType}\` | translate }}
  </div>
</div>
`;

// Test file 3: Complex dynamic patterns
const complexFile = `
export class DynamicTranslationService {
  
  // Multiple underscore segments
  getAccessMessage(module: string, permission: string) {
    return this.translate.get(\`ACCESS_RIGHTS_CONFIRMATION.\${module.toUpperCase()}.\${permission}\`);
  }
  
  // Function calls with parameters
  getErrorMessage(type: string) {
    return this.translate.instant(\`ERROR_MESSAGES.\${convertToSnakeCase(type)}\`);
  }
  
  // Conditional with underscores
  getMessage(isError: boolean, key: string) {
    const prefix = isError ? 'ERROR_MESSAGES' : 'SUCCESS_MESSAGES';
    return this.translate.get(\`\${prefix}.\${key.toUpperCase()}\`);
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'access-rights.component.ts'), templateFile);
fs.writeFileSync(path.join(srcDir, 'access-rights.component.html'), htmlTemplate);
fs.writeFileSync(path.join(srcDir, 'dynamic-translation.service.ts'), complexFile);

// Run analysis
console.log('📝 Test files created with underscore patterns:');
console.log('   - ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(key)}');
console.log('   - API_ENDPOINTS.${action.toUpperCase()}');
console.log('   - ERROR_MESSAGES.${errorType}');
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
  console.log('\n✅ All underscore keys properly detected via dynamic patterns!');
}

if (results.dynamicPatterns && results.dynamicPatterns.size > 0) {
  console.log('\n🔍 Dynamic patterns detected:');
  results.dynamicPatterns.forEach(pattern => console.log(`   - ${pattern}`));
}

if (results.dynamicMatches && results.dynamicMatches.size > 0) {
  console.log('\n🎯 Keys matched by dynamic patterns:');
  results.dynamicMatches.forEach(key => console.log(`   - ${key}`));
}

// Cleanup
fs.rmSync(testDir, { recursive: true, force: true });

// Test validation
const expectedPatterns = [
  'ACCESS_RIGHTS_CONFIRMATION.INFO.*',
  'API_ENDPOINTS.*', 
  'ERROR_MESSAGES.*'
];

const expectedKeys = [
  'ACCESS_RIGHTS_CONFIRMATION.INFO.USER_MANAGEMENT',
  'ACCESS_RIGHTS_CONFIRMATION.INFO.ADMIN_PANEL', 
  'ACCESS_RIGHTS_CONFIRMATION.INFO.REPORT_VIEWER',
  'ACCESS_RIGHTS_CONFIRMATION.INFO.DATA_EXPORT',
  'API_ENDPOINTS.USER_CREATE',
  'API_ENDPOINTS.USER_UPDATE',
  'API_ENDPOINTS.USER_DELETE',
  'ERROR_MESSAGES.VALIDATION_FAILED',
  'ERROR_MESSAGES.ACCESS_DENIED',
  'ERROR_MESSAGES.NETWORK_ERROR'
];

console.log('\n🔬 Test Validation:');

// Check if dynamic patterns were detected
let patternsDetected = 0;
if (results.dynamicPatterns) {
  expectedPatterns.forEach(pattern => {
    if (results.dynamicPatterns.includes(pattern)) {
      console.log(`   ✅ Pattern detected: ${pattern}`);
      patternsDetected++;
    } else {
      console.log(`   ❌ Pattern missing: ${pattern}`);
    }
  });
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
console.log(`   Patterns detected: ${patternsDetected}/${expectedPatterns.length}`);
console.log(`   Keys matched: ${keysMatched}/${expectedKeys.length}`);
console.log(`   Unused keys: ${results.unusedKeys.length} (should be 0)`);

if (results.unusedKeys.length === 0 && patternsDetected >= 2) {
  console.log('\n🎉 SUCCESS: Underscore patterns working correctly!');
  console.log('   The edge case ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(key)} is now supported!');
  process.exit(0);
} else {
  console.log('\n❌ FAILED: Some issues detected');
  process.exit(1);
}
