#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { analyzeTranslations, detectProjectStructure, generateConfig } = require('../lib/index');

// Test data setup
const testDir = path.join(__dirname, 'test-project');
const testI18nDir = path.join(testDir, 'src/assets/i18n');
const testSrcDir = path.join(testDir, 'src/app');

function setupTestProject() {
  // Clean up previous test
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
  
  // Create test structure
  fs.mkdirSync(testI18nDir, { recursive: true });
  fs.mkdirSync(testSrcDir, { recursive: true });
  
  // Create test translation files
  const enTranslations = {
    "welcome": "Welcome",
    "menu": {
      "home": "Home",
      "about": "About"
    },
    "buttons": {
      "save": "Save",
      "cancel": "Cancel"
    },
    "unused": "This is unused"
  };
  
  const esTranslations = {
    "welcome": "Bienvenido",
    "menu": {
      "home": "Inicio",
      "about": "Acerca de"
    },
    "buttons": {
      "save": "Guardar",
      "cancel": "Cancelar"
    },
    "unused": "Esto no se usa"
  };
  
  fs.writeFileSync(
    path.join(testI18nDir, 'en.json'), 
    JSON.stringify(enTranslations, null, 2)
  );
  
  fs.writeFileSync(
    path.join(testI18nDir, 'es.json'), 
    JSON.stringify(esTranslations, null, 2)
  );
  
  // Create test source files
  const appComponent = `
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: \`
    <h1>{{ 'welcome' | translate }}</h1>
    <nav>
      <a>{{ 'menu.home' | translate }}</a>
      <a>{{ 'menu.about' | translate }}</a>
    </nav>
    <button>{{ 'buttons.save' | translate }}</button>
  \`
})
export class AppComponent {
  constructor(private translate: TranslateService) {}
  
  getMessage() {
    return this.translate.instant('buttons.cancel');
  }
}
`;
  
  fs.writeFileSync(path.join(testSrcDir, 'app.component.ts'), appComponent);
  
  console.log('✅ Test project created');
}

function runTests() {
  console.log('🧪 Running Angular Translation Checker Tests\n');
  
  let passed = 0;
  let failed = 0;
  
  function test(name, fn) {
    try {
      console.log(`🔍 Testing: ${name}`);
      fn();
      console.log(`✅ PASS: ${name}\n`);
      passed++;
    } catch (error) {
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Error: ${error.message}\n`);
      failed++;
    }
  }
  
  // Test 1: Project Structure Detection
  test('Project structure detection', () => {
    const detected = detectProjectStructure(testDir);
    if (detected !== './src/assets/i18n') {
      throw new Error(`Expected './src/assets/i18n', got '${detected}'`);
    }
  });
  
  // Test 2: Basic Analysis
  test('Basic translation analysis', () => {
    const results = analyzeTranslations({
      localesPath: testI18nDir,
      srcPath: testSrcDir,
      verbose: false
    });
    
    if (results.totalKeys !== 6) {
      throw new Error(`Expected 6 total keys, got ${results.totalKeys}`);
    }
    
    if (results.usedKeysCount !== 5) {
      throw new Error(`Expected 5 used keys, got ${results.usedKeysCount}`);
    }
    
    if (results.unusedKeys.length !== 1) {
      throw new Error(`Expected 1 unused key, got ${results.unusedKeys.length}`);
    }
    
    if (!results.unusedKeys.includes('unused')) {
      throw new Error(`Expected 'unused' key to be unused`);
    }
  });
  
  // Test 3: Config Generation
  test('Configuration file generation', () => {
    const configPath = path.join(testDir, 'test-config.json');
    generateConfig(configPath, { verbose: true });
    
    if (!fs.existsSync(configPath)) {
      throw new Error('Config file was not created');
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!config.localesPath || !config.srcPath) {
      throw new Error('Config file missing required properties');
    }
  });
  
  // Test 4: JSON Output Format
  test('JSON output format', () => {
    const results = analyzeTranslations({
      localesPath: testI18nDir,
      srcPath: testSrcDir,
      outputFormat: 'json'
    });
    
    const requiredFields = ['totalKeys', 'usedKeysCount', 'unusedKeys', 'missingKeys'];
    for (const field of requiredFields) {
      if (!(field in results)) {
        throw new Error(`Missing field in results: ${field}`);
      }
    }
  });
  
  // Test 5: Nested Translation Keys
  test('Nested translation key detection', () => {
    const results = analyzeTranslations({
      localesPath: testI18nDir,
      srcPath: testSrcDir
    });
    
    const expectedUsedKeys = ['welcome', 'menu.home', 'menu.about', 'buttons.save', 'buttons.cancel'];
    for (const key of expectedUsedKeys) {
      if (!results.usedKeys.includes(key)) {
        throw new Error(`Expected used key not found: ${key}`);
      }
    }
  });
  
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Total: ${passed + failed}`);
  
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

function cleanup() {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
    console.log('🧹 Test cleanup completed');
  }
}

// Run tests
if (require.main === module) {
  setupTestProject();
  runTests();
  cleanup();
}

module.exports = { setupTestProject, runTests, cleanup };
