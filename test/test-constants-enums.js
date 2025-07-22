#!/usr/bin/env node

const { analyzeTranslations } = require('../lib/index');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Constants and Enums Detection...\n');

// Create test translation file with various nested keys
const testTranslations = {
  "error": {
    "message": "Error occurred",
    "network": "Network error",
    "validation": "Validation error"
  },
  "success": {
    "message": "Success",
    "saved": "Successfully saved",
    "updated": "Successfully updated"
  },
  "user": {
    "profile": {
      "name": "User Name",
      "email": "Email Address"
    },
    "settings": {
      "theme": "Theme Settings",
      "notifications": "Notification Settings"
    }
  },
  "admin": {
    "panel": {
      "dashboard": "Admin Dashboard",
      "users": "User Management"
    }
  },
  "api": {
    "endpoints": {
      "users": "Users API",
      "auth": "Authentication API"
    }
  }
};

// Create test directory structure
const testDir = path.join(__dirname, 'constants-enum-test');
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}
fs.mkdirSync(testDir, { recursive: true });

// Create locales directory and translation file
const localesDir = path.join(testDir, 'src', 'assets', 'i18n');
fs.mkdirSync(localesDir, { recursive: true });
fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(testTranslations, null, 2));

// Create source files with constants and enums
const srcDir = path.join(testDir, 'src', 'app');
fs.mkdirSync(srcDir, { recursive: true });

// Test file 1: Object literals with translation keys
const constantsFile = `
export class TranslationConstants {
  
  // Object literal with translation keys
  public static readonly MESSAGES = {
    ERROR: 'error.message',
    SUCCESS: 'success.message',
    NETWORK_ERROR: 'error.network',
    VALIDATION_ERROR: 'error.validation'
  };
  
  // Simple constants
  public static readonly USER_PROFILE_NAME = 'user.profile.name';
  public static readonly USER_PROFILE_EMAIL = 'user.profile.email';
  
  // Private constants
  private readonly ADMIN_DASHBOARD = 'admin.panel.dashboard';
  private readonly ADMIN_USERS = 'admin.panel.users';
  
  // Regular constants (not class properties)
  const SUCCESS_SAVED = 'success.saved';
  const SUCCESS_UPDATED = 'success.updated';
}

// Module-level constants
export const API_ENDPOINTS = {
  USERS: 'api.endpoints.users',
  AUTH: 'api.endpoints.auth'
};

const USER_SETTINGS = {
  THEME: 'user.settings.theme',
  NOTIFICATIONS: 'user.settings.notifications'
};
`;

// Test file 2: Enums with translation keys
const enumsFile = `
// Enum with translation keys
export enum ErrorMessages {
  NETWORK = 'error.network',
  VALIDATION = 'error.validation',
  GENERAL = 'error.message'
}

export enum SuccessMessages {
  SAVED = 'success.saved',
  UPDATED = 'success.updated',
  GENERAL = 'success.message'
}

// Enum without explicit values (should be ignored)
export enum UserActions {
  CREATE,
  UPDATE,
  DELETE
}

// Mixed enum (only translation-like values should be detected)
export enum MixedEnum {
  CONSTANT_VALUE = 1,
  TRANSLATION_KEY = 'user.profile.name',
  ANOTHER_CONSTANT = 'not.a.translation.key.because.too.many.dots',
  VALID_TRANSLATION = 'admin.panel.dashboard'
}
`;

// Test file 3: Complex scenarios with constants used in translate calls
const usageFile = `
import { Component } from '@angular/core';
import { TranslationConstants } from './constants';
import { ErrorMessages } from './enums';

@Component({
  selector: 'app-test',
  template: \`
    <!-- Direct constant usage -->
    <p>{{ TranslationConstants.USER_PROFILE_NAME | translate }}</p>
    
    <!-- Enum usage -->
    <div *ngIf="hasError">{{ ErrorMessages.NETWORK | translate }}</div>
  \`
})
export class TestComponent {
  
  // Class property with translation key
  readonly errorMessage = 'error.message';
  public successMessage: string = 'success.message';
  
  // Methods using constants
  showError() {
    return this.translate.get(TranslationConstants.MESSAGES.ERROR);
  }
  
  showSuccess() {
    return this.translate.instant(ErrorMessages.VALIDATION);
  }
  
  // Mixed usage
  getUserMessage() {
    const key = this.isAdmin ? 'admin.panel.dashboard' : 'user.settings.theme';
    return this.translate.get(key);
  }
}
`;

// Test file 4: TypeScript interface and type definitions (should be ignored)
const typesFile = `
// Interface definitions (should not be detected as translation keys)
export interface UserConfig {
  name: string;
  email: string;
  theme: 'user.settings.theme'; // This should NOT be detected as it's a type
}

// Type definitions
type MessageType = 'error.message' | 'success.message'; // These should NOT be detected

// However, default values in interfaces could be translation keys
export interface ComponentConfig {
  defaultErrorMessage?: string = 'error.message'; // This SHOULD be detected
}
`;

fs.writeFileSync(path.join(srcDir, 'constants.ts'), constantsFile);
fs.writeFileSync(path.join(srcDir, 'enums.ts'), enumsFile);
fs.writeFileSync(path.join(srcDir, 'usage.component.ts'), usageFile);
fs.writeFileSync(path.join(srcDir, 'types.ts'), typesFile);

// Run analysis
console.log('📝 Test files created with constants and enums:');
console.log('   - Object literals: MESSAGES = { ERROR: "error.message" }');
console.log('   - Simple constants: SUCCESS_SAVED = "success.saved"');
console.log('   - Enums: ErrorMessages { NETWORK = "error.network" }');
console.log('   - Class properties: readonly errorMessage = "error.message"');
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
  console.log('\n✅ All keys properly detected via constants and enums!');
}

// Test validation
const expectedConstantKeys = [
  'error.message',
  'success.message', 
  'error.network',
  'error.validation',
  'user.profile.name',
  'user.profile.email',
  'admin.panel.dashboard',
  'admin.panel.users',
  'success.saved',
  'success.updated',
  'api.endpoints.users',
  'api.endpoints.auth',
  'user.settings.theme',
  'user.settings.notifications'
];

console.log('\n🔬 Test Validation:');

// Check if constant keys were detected
let constantsDetected = 0;
expectedConstantKeys.forEach(key => {
  if (results.usedKeys && results.usedKeys.has && results.usedKeys.has(key)) {
    console.log(`   ✅ Constant key detected: ${key}`);
    constantsDetected++;
  } else if (results.usedKeys && results.usedKeys.includes && results.usedKeys.includes(key)) {
    console.log(`   ✅ Constant key detected: ${key}`);
    constantsDetected++;
  } else {
    console.log(`   ❌ Constant key missing: ${key}`);
  }
});

console.log(`\n📈 Test Summary:`);
console.log(`   Constants detected: ${constantsDetected}/${expectedConstantKeys.length}`);
console.log(`   Unused keys: ${results.unusedKeys.length} (should be 0)`);

// Cleanup
fs.rmSync(testDir, { recursive: true, force: true });

if (results.unusedKeys.length === 0 && constantsDetected >= 10) {
  console.log('\n🎉 SUCCESS: Constants and enums detection working correctly!');
  console.log('   Translation keys in constants, enums, and object literals are now supported!');
  process.exit(0);
} else {
  console.log('\n❌ FAILED: Some issues detected');
  console.log(`   Expected at least 10 constant keys, got ${constantsDetected}`);
  process.exit(1);
}
