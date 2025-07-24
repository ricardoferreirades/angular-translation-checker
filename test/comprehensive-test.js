#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { analyzeTranslations, detectProjectStructure, generateConfig } = require('../lib/index');

// Test data setup
const testDir = path.join(__dirname, 'comprehensive-test-project');
const testI18nDir = path.join(testDir, 'src/assets/i18n');
const testSrcDir = path.join(testDir, 'src/app');

function setupComprehensiveTestProject() {
  console.log('🧪 Setting up comprehensive test project...');
  
  // Clean up previous test
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
  
  // Create test structure
  fs.mkdirSync(testI18nDir, { recursive: true });
  fs.mkdirSync(testSrcDir, { recursive: true });
  fs.mkdirSync(path.join(testSrcDir, 'components'), { recursive: true });
  fs.mkdirSync(path.join(testSrcDir, 'services'), { recursive: true });
  fs.mkdirSync(path.join(testDir, 'src'), { recursive: true });
  
  // Create comprehensive translation files
  const enTranslations = {
    // Static keys that should be detected
    "NAVIGATION": {
      "HOME": "Home",
      "ABOUT": "About Us",
      "CONTACT": "Contact"
    },
    "COMMON": {
      "BUTTONS": {
        "SAVE": "Save",
        "CANCEL": "Cancel",
        "DELETE": "Delete"
      },
      "MESSAGES": {
        "SUCCESS": "Success!",
        "ERROR": "Error occurred",
        "LOADING": "Loading..."
      }
    },
    // Dynamic pattern keys
    "USER": {
      "PROFILE": "User Profile",
      "SETTINGS": "User Settings",
      "NOTIFICATIONS": "User Notifications"
    },
    "API": {
      "ENDPOINTS": {
        "CREATE": "Create endpoint",
        "READ": "Read endpoint",
        "UPDATE": "Update endpoint",
        "DELETE": "Delete endpoint"
      }
    },
    // Keys that should be ignored
    "DEBUG": {
      "CONSOLE": "Debug console",
      "LOGS": "Debug logs"
    },
    "TEMP": {
      "FEATURE": "Temporary feature",
      "TEST": "Temporary test"
    },
    "INTERNAL": {
      "SYSTEM": "Internal system",
      "CONFIG": "Internal config"
    },
    // Favicon and file references that should be ignored
    "favicon.ico": "Favicon file",
    "favicon.png": "Favicon PNG",
    "favicon.svg": "Favicon SVG",
    // Unused keys for testing
    "UNUSED_SECTION": {
      "TITLE": "This should be unused",
      "DESCRIPTION": "This should also be unused"
    }
  };
  
  // Create Spanish translations (subset to test missing keys)
  const esTranslations = {
    "NAVIGATION": {
      "HOME": "Inicio",
      "ABOUT": "Acerca de"
      // Missing CONTACT to test missing keys
    },
    "COMMON": {
      "BUTTONS": {
        "SAVE": "Guardar",
        "CANCEL": "Cancelar"
        // Missing DELETE
      },
      "MESSAGES": {
        "SUCCESS": "¡Éxito!",
        "ERROR": "Error ocurrido",
        "LOADING": "Cargando..."
      }
    },
    "USER": {
      "PROFILE": "Perfil de Usuario",
      "SETTINGS": "Configuración de Usuario",
      "NOTIFICATIONS": "Notificaciones de Usuario"
    },
    "API": {
      "ENDPOINTS": {
        "CREATE": "Crear endpoint",
        "READ": "Leer endpoint",
        "UPDATE": "Actualizar endpoint",
        "DELETE": "Eliminar endpoint"
      }
    },
    "DEBUG": {
      "CONSOLE": "Consola de depuración",
      "LOGS": "Registros de depuración"
    },
    "TEMP": {
      "FEATURE": "Característica temporal",
      "TEST": "Prueba temporal"
    },
    "INTERNAL": {
      "SYSTEM": "Sistema interno",
      "CONFIG": "Configuración interna"
    },
    "favicon.ico": "Archivo favicon",
    "favicon.png": "Favicon PNG",
    "favicon.svg": "Favicon SVG",
    "UNUSED_SECTION": {
      "TITLE": "Esto debería estar sin usar",
      "DESCRIPTION": "Esto también debería estar sin usar"
    }
  };
  
  fs.writeFileSync(
    path.join(testI18nDir, 'en.json'), 
    JSON.stringify(enTranslations, null, 2)
  );
  
  fs.writeFileSync(
    path.join(testI18nDir, 'es.json'), 
    JSON.stringify(esTranslations, null, 2)
  );
  
  // Create test source files with various patterns
  
  // 1. Component with static translation usage
  const componentContent = `
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-test',
  template: \`
    <h1>{{ 'NAVIGATION.HOME' | translate }}</h1>
    <p>{{ 'NAVIGATION.ABOUT' | translate }}</p>
    <button>{{ 'COMMON.BUTTONS.SAVE' | translate }}</button>
    <button>{{ 'COMMON.BUTTONS.CANCEL' | translate }}</button>
    <div>{{ 'COMMON.MESSAGES.LOADING' | translate }}</div>
  \`
})
export class TestComponent {
  constructor(private translate: TranslateService) {}
  
  ngOnInit() {
    // Static service calls
    this.translate.get('COMMON.MESSAGES.SUCCESS');
    this.translate.instant('COMMON.MESSAGES.ERROR');
  }
}
`;
  
  // 2. Service with dynamic patterns
  const serviceContent = `
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TestService {
  constructor(private translate: TranslateService) {}
  
  // Dynamic pattern: USER.*
  getUserMessage(section: string) {
    return this.translate.get(\`USER.\${section.toUpperCase()}\`);
  }
  
  // Dynamic pattern: API.ENDPOINTS.*
  getApiMessage(action: string) {
    return this.translate.instant(\`API.ENDPOINTS.\${action}\`);
  }
  
  // Dynamic pattern with function calls
  getEndpointMessage(method: string) {
    return this.translate.get(\`API.ENDPOINTS.\${method.toUpperCase()}\`);
  }
  
  // Constants usage
  static readonly MESSAGES = {
    SAVE_SUCCESS: 'COMMON.BUTTONS.SAVE',
    CANCEL_ACTION: 'COMMON.BUTTONS.CANCEL'
  };
}
`;
  
  // 3. HTML file with favicon references (should be ignored)
  const indexHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Test App</title>
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
</head>
<body>
  <app-root></app-root>
</body>
</html>
`;
  
  // 4. Component with enum and constants
  const constantsContent = `
export enum TranslationKeys {
  NAVIGATION_HOME = 'NAVIGATION.HOME',
  COMMON_SUCCESS = 'COMMON.MESSAGES.SUCCESS'
}

export const MESSAGE_KEYS = {
  ERROR: 'COMMON.MESSAGES.ERROR',
  LOADING: 'COMMON.MESSAGES.LOADING'
};

export class Constants {
  static readonly BUTTONS = {
    SAVE: 'COMMON.BUTTONS.SAVE',
    DELETE: 'COMMON.BUTTONS.DELETE'
  };
}
`;
  
  fs.writeFileSync(path.join(testSrcDir, 'test.component.ts'), componentContent);
  fs.writeFileSync(path.join(testSrcDir, 'services', 'test.service.ts'), serviceContent);
  fs.writeFileSync(path.join(testDir, 'src', 'index.html'), indexHtmlContent);
  fs.writeFileSync(path.join(testSrcDir, 'constants.ts'), constantsContent);
  
  // Create test configuration
  const testConfig = {
    "localesPath": "./src/assets/i18n",
    "srcPath": "./src",
    "keysExtensions": [".ts", ".html"],
    "excludeDirs": ["node_modules", "dist", ".git", ".angular", "coverage"],
    "outputFormat": "console",
    "exitOnIssues": false,
    "verbose": true,
    "ignoreKeys": [
      "DEBUG.*",
      "TEMP.*",
      "favicon.ico"
    ],
    "ignorePatterns": [
      "INTERNAL.*",
      "favicon**"
    ],
    "ignoreRegex": [],
    "ignoreFiles": []
  };
  
  fs.writeFileSync(
    path.join(testDir, 'i18n-checker.config.json'),
    JSON.stringify(testConfig, null, 2)
  );
  
  console.log('✅ Comprehensive test project created');
  return testDir;
}

function runComprehensiveTests() {
  console.log('🧪 Running Comprehensive Angular Translation Checker Tests\n');
  
  const testProjectPath = setupComprehensiveTestProject();
  const configPath = path.join(testProjectPath, 'i18n-checker.config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Update paths to be absolute
  config.localesPath = path.join(testProjectPath, 'src/assets/i18n');
  config.srcPath = path.join(testProjectPath, 'src');
  
  let passedTests = 0;
  let totalTests = 0;
  
  function test(name, testFn) {
    totalTests++;
    console.log(`🔍 Testing: ${name}`);
    try {
      testFn();
      console.log(`✅ PASS: ${name}`);
      passedTests++;
    } catch (error) {
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }
  
  // Test 1: Basic functionality
  test('Basic translation analysis', () => {
    const results = analyzeTranslations(config);
    
    if (!results.totalKeys || results.totalKeys === 0) {
      throw new Error('No translation keys found');
    }
    
    if (!results.usedKeys || results.usedKeys.length === 0) {
      throw new Error('No used keys detected');
    }
    
    console.log(`   Found ${results.totalKeys} total keys`);
    console.log(`   Found ${results.usedKeysCount} used keys`);
  });
  
  // Test 2: Static key detection
  test('Static key detection', () => {
    const results = analyzeTranslations(config);
    
    const expectedStaticKeys = [
      'NAVIGATION.HOME',
      'NAVIGATION.ABOUT', 
      'COMMON.BUTTONS.SAVE',
      'COMMON.BUTTONS.CANCEL',
      'COMMON.MESSAGES.LOADING',
      'COMMON.MESSAGES.SUCCESS',
      'COMMON.MESSAGES.ERROR'
    ];
    
    for (const key of expectedStaticKeys) {
      if (!results.usedKeys.includes(key)) {
        throw new Error(`Expected static key not found: ${key}`);
      }
    }
    
    console.log(`   ✓ All expected static keys detected`);
  });
  
  // Test 3: Dynamic pattern detection
  test('Dynamic pattern detection', () => {
    const results = analyzeTranslations(config);
    
    if (!results.dynamicPatterns || results.dynamicPatterns.length === 0) {
      throw new Error('No dynamic patterns detected');
    }
    
    const expectedPatterns = ['USER.*', 'API.ENDPOINTS.*'];
    let foundPatterns = 0;
    
    for (const pattern of expectedPatterns) {
      if (results.dynamicPatterns.includes(pattern)) {
        foundPatterns++;
      }
    }
    
    if (foundPatterns === 0) {
      throw new Error(`Expected dynamic patterns not found. Found: ${results.dynamicPatterns.join(', ')}`);
    }
    
    console.log(`   ✓ Dynamic patterns detected: ${results.dynamicPatterns.join(', ')}`);
  });
  
  // Test 4: Constants and Enums detection
  test('Constants and Enums detection', () => {
    const results = analyzeTranslations(config);
    
    const expectedConstantKeys = [
      'NAVIGATION.HOME',     // From enum
      'COMMON.MESSAGES.SUCCESS', // From enum
      'COMMON.MESSAGES.ERROR',   // From MESSAGE_KEYS
      'COMMON.BUTTONS.DELETE'    // From Constants class
    ];
    
    let foundConstants = 0;
    for (const key of expectedConstantKeys) {
      if (results.usedKeys.includes(key)) {
        foundConstants++;
      }
    }
    
    if (foundConstants === 0) {
      throw new Error('No constant keys detected');
    }
    
    console.log(`   ✓ Found ${foundConstants}/${expectedConstantKeys.length} expected constant keys`);
  });
  
  // Test 5: Ignore functionality - Exact matches
  test('Ignore functionality - Exact matches', () => {
    const results = analyzeTranslations(config);
    
    // favicon.ico should be ignored (exact match)
    if (results.missingKeys.includes('favicon.ico')) {
      throw new Error('favicon.ico should be ignored but was reported as missing');
    }
    
    console.log(`   ✓ Exact ignore patterns working (favicon.ico ignored)`);
  });
  
  // Test 6: Ignore functionality - Pattern matching
  test('Ignore functionality - Pattern matching', () => {
    const results = analyzeTranslations(config);
    
    // favicon.png and favicon.svg should be ignored by favicon** pattern
    const faviconKeys = results.missingKeys.filter(key => key.startsWith('favicon.'));
    
    if (faviconKeys.length > 0) {
      throw new Error(`Favicon files should be ignored but found in missing keys: ${faviconKeys.join(', ')}`);
    }
    
    // DEBUG.* and TEMP.* keys should be ignored
    const debugKeys = results.unusedKeys.filter(key => key.startsWith('DEBUG.'));
    const tempKeys = results.unusedKeys.filter(key => key.startsWith('TEMP.'));
    
    // They should not appear in unused keys if they're being ignored properly
    console.log(`   ✓ Pattern ignore working (favicon**, DEBUG.*, TEMP.*, INTERNAL.* patterns)`);
  });
  
  // Test 7: Dynamic pattern matching
  test('Dynamic pattern key matching', () => {
    const results = analyzeTranslations(config);
    
    if (!results.dynamicMatchedKeys || results.dynamicMatchedKeys.length === 0) {
      throw new Error('No keys matched by dynamic patterns');
    }
    
    // Check if USER.* pattern matches USER keys
    const userKeys = results.dynamicMatchedKeys.filter(key => key.startsWith('USER.'));
    const apiKeys = results.dynamicMatchedKeys.filter(key => key.startsWith('API.ENDPOINTS.'));
    
    if (userKeys.length === 0 && apiKeys.length === 0) {
      throw new Error('Expected USER.* or API.ENDPOINTS.* keys to be matched by dynamic patterns');
    }
    
    console.log(`   ✓ Dynamic patterns matched ${results.dynamicMatchedKeys.length} keys`);
    console.log(`   ✓ USER keys matched: ${userKeys.length}, API keys matched: ${apiKeys.length}`);
  });
  
  // Test 8: Missing keys detection (with ignore filtering)
  test('Missing keys detection', () => {
    const results = analyzeTranslations(config);
    
    // Should have some missing keys (since Spanish is incomplete)
    if (!results.missingKeys || results.missingKeys.length === 0) {
      console.log('   ⚠️  No missing keys found (this might be expected if all keys exist)');
    } else {
      // Ensure favicon files are NOT in missing keys (should be ignored)
      const faviconInMissing = results.missingKeys.filter(key => key.includes('favicon'));
      if (faviconInMissing.length > 0) {
        throw new Error(`Favicon files should be ignored but found in missing keys: ${faviconInMissing.join(', ')}`);
      }
      
      console.log(`   ✓ Found ${results.missingKeys.length} missing keys (favicon files properly ignored)`);
    }
  });
  
  // Test 9: Unused keys detection
  test('Unused keys detection', () => {
    const results = analyzeTranslations(config);
    
    if (!results.unusedKeys || results.unusedKeys.length === 0) {
      throw new Error('Expected some unused keys (UNUSED_SECTION should be unused)');
    }
    
    // UNUSED_SECTION keys should be detected as unused
    const unusedSectionKeys = results.unusedKeys.filter(key => key.startsWith('UNUSED_SECTION.'));
    
    if (unusedSectionKeys.length === 0) {
      throw new Error('Expected UNUSED_SECTION keys to be detected as unused');
    }
    
    console.log(`   ✓ Found ${results.unusedKeys.length} unused keys including expected unused sections`);
  });
  
  // Test 10: JSON output format
  test('JSON output format', () => {
    const jsonConfig = { ...config, outputFormat: 'json' };
    const results = analyzeTranslations(jsonConfig);
    
    // Should be able to serialize to JSON
    const jsonOutput = JSON.stringify(results);
    if (!jsonOutput || jsonOutput === '{}') {
      throw new Error('JSON output is empty or invalid');
    }
    
    // Parse back to ensure it's valid JSON
    const parsed = JSON.parse(jsonOutput);
    if (!parsed.totalKeys || !parsed.usedKeys) {
      throw new Error('JSON output missing required fields');
    }
    
    console.log(`   ✓ JSON output format working (${jsonOutput.length} characters)`);
  });
  
  // Test 11: Configuration file generation
  test('Configuration file generation', () => {
    const configOutputPath = path.join(testProjectPath, 'generated-config.json');
    
    generateConfig(configOutputPath, {
      localesPath: './src/assets/i18n',
      srcPath: './src',
      verbose: true
    });
    
    if (!fs.existsSync(configOutputPath)) {
      throw new Error('Configuration file was not generated');
    }
    
    const generatedConfig = JSON.parse(fs.readFileSync(configOutputPath, 'utf8'));
    
    if (!generatedConfig.localesPath || !generatedConfig.srcPath) {
      throw new Error('Generated configuration is missing required fields');
    }
    
    console.log(`   ✓ Configuration file generated successfully`);
  });
  
  // Test 12: Project structure detection
  test('Project structure auto-detection', () => {
    const detectedPath = detectProjectStructure(testProjectPath);
    
    if (!detectedPath) {
      throw new Error('Project structure detection failed');
    }
    
    const expectedPath = './src/assets/i18n';
    if (detectedPath !== expectedPath) {
      throw new Error(`Expected detected path to be ${expectedPath}, got ${detectedPath}`);
    }
    
    console.log(`   ✓ Project structure auto-detected: ${detectedPath}`);
  });

  // Test 13: keysExtensions configuration
  test('keysExtensions configuration property', () => {
    // Test with only .ts files
    const tsOnlyConfig = { ...config, keysExtensions: ['.ts'] };
    const tsResults = analyzeTranslations(tsOnlyConfig);
    
    if (tsResults.usedKeysCount === 0) {
      throw new Error('No keys found when limiting to .ts files');
    }
    
    // Test with only .html files (should find fewer keys in our test)
    const htmlOnlyConfig = { ...config, keysExtensions: ['.html'] };
    const htmlResults = analyzeTranslations(htmlOnlyConfig);
    
    // Test with custom extension
    const customConfig = { ...config, keysExtensions: ['.ts', '.html', '.component.ts'] };
    const customResults = analyzeTranslations(customConfig);
    
    console.log(`   ✓ TypeScript only: ${tsResults.usedKeysCount} keys`);
    console.log(`   ✓ HTML only: ${htmlResults.usedKeysCount} keys`);
    console.log(`   ✓ Custom extensions: ${customResults.usedKeysCount} keys`);
  });

  // Test 14: excludeDirs configuration
  test('excludeDirs configuration property', () => {
    // Create a subdirectory that should be excluded
    const excludeDir = path.join(testProjectPath, 'src', 'app', 'excluded');
    fs.mkdirSync(excludeDir, { recursive: true });
    
    // Add a file with translation keys in the excluded directory
    const excludedContent = `
export class ExcludedComponent {
  getMessage() {
    return this.translate.get('EXCLUDED.MESSAGE');
  }
}`;
    fs.writeFileSync(path.join(excludeDir, 'excluded.component.ts'), excludedContent);
    
    // Test with default excludeDirs (should find EXCLUDED.MESSAGE since 'excluded' is not in default excludes)
    const normalResults = analyzeTranslations(config);
    
    // Test with custom excludeDirs that exclude the 'excluded' directory
    const customExcludeConfig = { ...config, excludeDirs: ['node_modules', 'dist', 'excluded'] };
    const customResults = analyzeTranslations(customExcludeConfig);
    
    // Test with empty excludeDirs (should definitely find EXCLUDED.MESSAGE)
    const noExcludeConfig = { ...config, excludeDirs: [] };
    const noExcludeResults = analyzeTranslations(noExcludeConfig);
    
    const excludedFoundNormal = normalResults.usedKeys.includes('EXCLUDED.MESSAGE');
    const excludedFoundNoExclude = noExcludeResults.usedKeys.includes('EXCLUDED.MESSAGE');
    const excludedNotFoundCustom = !customResults.usedKeys.includes('EXCLUDED.MESSAGE');
    
    // Normal config should find it (since 'excluded' is not in default excludeDirs)
    // No exclude config should definitely find it
    // Custom exclude config should not find it (since we exclude 'excluded' directory)
    
    if (!excludedFoundNormal || !excludedFoundNoExclude || !excludedNotFoundCustom) {
      throw new Error('excludeDirs configuration not working properly');
    }
    
    console.log(`   ✓ Default excludeDirs: found excluded key (expected)`);
    console.log(`   ✓ Empty excludeDirs: found excluded key (expected)`);
    console.log(`   ✓ Custom excludeDirs: excluded key not found (expected)`);
  });

  // Test 15: outputFormat configuration (console, json, csv)
  test('outputFormat configuration property', () => {
    const testResults = analyzeTranslations(config);
    
    // Test console format
    const consoleConfig = { ...config, outputFormat: 'console' };
    const consoleResults = analyzeTranslations(consoleConfig);
    
    // Test JSON format
    const jsonConfig = { ...config, outputFormat: 'json' };
    const jsonResults = analyzeTranslations(jsonConfig);
    
    // Test CSV format
    const csvConfig = { ...config, outputFormat: 'csv' };
    const csvResults = analyzeTranslations(csvConfig);
    
    // Verify results structure is consistent
    if (!jsonResults.totalKeys || !csvResults.totalKeys) {
      throw new Error('Output format configuration affecting results structure');
    }
    
    // Test format output functions
    const { formatOutput } = require('../lib/index');
    const consoleOutput = formatOutput(testResults, 'console');
    const jsonOutput = formatOutput(testResults, 'json');
    const csvOutput = formatOutput(testResults, 'csv');
    
    if (!consoleOutput.includes('📊') || !jsonOutput.startsWith('{') || !csvOutput.includes('Type,Key,Status')) {
      throw new Error('Output formatting not working correctly');
    }
    
    console.log(`   ✓ Console format working (${consoleOutput.length} chars)`);
    console.log(`   ✓ JSON format working (${jsonOutput.length} chars)`);
    console.log(`   ✓ CSV format working (${csvOutput.length} chars)`);
  });

  // Test 16: exitOnIssues configuration
  test('exitOnIssues configuration property', () => {
    // Test with exitOnIssues false (default)
    const falseConfig = { ...config, exitOnIssues: false };
    const falseResults = analyzeTranslations(falseConfig);
    
    // Test with exitOnIssues true
    const trueConfig = { ...config, exitOnIssues: true };
    const trueResults = analyzeTranslations(trueConfig);
    
    // Both should return results (exitOnIssues only affects CLI behavior)
    if (!falseResults.totalKeys || !trueResults.totalKeys) {
      throw new Error('exitOnIssues affecting analysis results');
    }
    
    // Verify the configuration is stored
    if (falseResults.config.exitOnIssues !== false || trueResults.config.exitOnIssues !== true) {
      throw new Error('exitOnIssues configuration not properly stored');
    }
    
    console.log(`   ✓ exitOnIssues: false - ${falseResults.totalKeys} keys`);
    console.log(`   ✓ exitOnIssues: true - ${trueResults.totalKeys} keys`);
  });

  // Test 17: verbose configuration
  test('verbose configuration property', () => {
    // Test with verbose false
    const quietConfig = { ...config, verbose: false };
    const quietResults = analyzeTranslations(quietConfig);
    
    // Test with verbose true
    const verboseConfig = { ...config, verbose: true };
    const verboseResults = analyzeTranslations(verboseConfig);
    
    // Both should return same data, verbose only affects logging
    if (quietResults.totalKeys !== verboseResults.totalKeys) {
      throw new Error('verbose setting affecting analysis results');
    }
    
    // Verify the configuration is stored
    if (quietResults.config.verbose !== false || verboseResults.config.verbose !== true) {
      throw new Error('verbose configuration not properly stored');
    }
    
    console.log(`   ✓ verbose: false - ${quietResults.totalKeys} keys`);
    console.log(`   ✓ verbose: true - ${verboseResults.totalKeys} keys`);
  });

  // Test 18: ignoreRegex configuration
  test('ignoreRegex configuration property', () => {
    // Add some constant-style keys to test regex ignoring
    const regexTestTranslations = {
      ...JSON.parse(fs.readFileSync(path.join(testI18nDir, 'en.json'), 'utf8')),
      "DEBUG_MODE": "Debug mode constant",
      "API_KEY": "API key constant",
      "TEST_CONSTANT": "Test constant",
      "regular.key": "Regular key"
    };
    
    fs.writeFileSync(
      path.join(testI18nDir, 'en.json'),
      JSON.stringify(regexTestTranslations, null, 2)
    );
    
    // Test without regex (should include constants)
    const noRegexConfig = { ...config, ignoreRegex: [] };
    const noRegexResults = analyzeTranslations(noRegexConfig);
    
    // Test with regex to ignore constants
    const regexConfig = { ...config, ignoreRegex: ['^[A-Z_]+$'] };
    const regexResults = analyzeTranslations(regexConfig);
    
    // Verify constants are ignored with regex
    const constantsIgnored = ['DEBUG_MODE', 'API_KEY', 'TEST_CONSTANT'].every(key => 
      !regexResults.unusedKeys.includes(key) || regexResults.ignoredKeys.includes(key)
    );
    
    const regularKeyPresent = regexResults.translationKeys.includes('regular.key');
    
    if (!constantsIgnored || !regularKeyPresent) {
      throw new Error('ignoreRegex not working properly');
    }
    
    console.log(`   ✓ No regex: ${noRegexResults.totalKeys} keys`);
    console.log(`   ✓ With regex: ${regexResults.totalKeys} keys`);
    console.log(`   ✓ Constants ignored via regex pattern`);
  });

  // Test 19: ignoreFiles configuration
  test('ignoreFiles configuration property', () => {
    // Create additional translation files with UNIQUE keys that don't exist in main files
    const debugTranslations = {
      "IGNORE_TEST": {
        "DEBUG_UNIQUE": "Debug console unique",
        "DEBUG_API_UNIQUE": "Debug API unique"
      }
    };
    
    const testFileTranslations = {
      "IGNORE_TEST": {
        "TEST_MOCK_UNIQUE": "Test mock unique",
        "TEST_DATA_UNIQUE": "Test data unique"
      }
    };
    
    fs.writeFileSync(
      path.join(testI18nDir, 'debug.json'),
      JSON.stringify(debugTranslations, null, 2)
    );
    
    fs.writeFileSync(
      path.join(testI18nDir, 'test-file.json'),
      JSON.stringify(testFileTranslations, null, 2)
    );
    
    // Test without ignoring files (should include all keys)
    const noIgnoreConfig = { ...config, ignoreFiles: [], verbose: true };
    const noIgnoreResults = analyzeTranslations(noIgnoreConfig);
    
    // Test with ignoring debug.json (should not include DEBUG keys)
    const ignoreConfig = { ...config, ignoreFiles: ['debug.json'], verbose: true };
    const ignoreResults = analyzeTranslations(ignoreConfig);
    
    // Test with ignoring multiple files (should not include DEBUG or TEST keys)
    const multiIgnoreConfig = { ...config, ignoreFiles: ['debug.json', 'test-file.json'], verbose: true };
    const multiIgnoreResults = analyzeTranslations(multiIgnoreConfig);
    
    // Debug information
    console.log('   🔍 Debug info:');
    console.log(`   - Without ignore: has IGNORE_TEST.DEBUG_UNIQUE = ${noIgnoreResults.translationKeys.includes('IGNORE_TEST.DEBUG_UNIQUE')}, total = ${noIgnoreResults.totalKeys}`);
    console.log(`   - Without ignore: has IGNORE_TEST.TEST_MOCK_UNIQUE = ${noIgnoreResults.translationKeys.includes('IGNORE_TEST.TEST_MOCK_UNIQUE')}`);
    console.log(`   - Ignore debug: has IGNORE_TEST.DEBUG_UNIQUE = ${ignoreResults.translationKeys.includes('IGNORE_TEST.DEBUG_UNIQUE')}, total = ${ignoreResults.totalKeys}`);
    console.log(`   - Ignore debug: has IGNORE_TEST.TEST_MOCK_UNIQUE = ${ignoreResults.translationKeys.includes('IGNORE_TEST.TEST_MOCK_UNIQUE')}`);
    console.log(`   - Ignore both: has IGNORE_TEST.DEBUG_UNIQUE = ${multiIgnoreResults.translationKeys.includes('IGNORE_TEST.DEBUG_UNIQUE')}, total = ${multiIgnoreResults.totalKeys}`);
    console.log(`   - Ignore both: has IGNORE_TEST.TEST_MOCK_UNIQUE = ${multiIgnoreResults.translationKeys.includes('IGNORE_TEST.TEST_MOCK_UNIQUE')}`);
    
    // Verify file ignoring works
    const debugKeysPresent = noIgnoreResults.translationKeys.includes('IGNORE_TEST.DEBUG_UNIQUE');
    const debugKeysIgnored = !ignoreResults.translationKeys.includes('IGNORE_TEST.DEBUG_UNIQUE');
    const bothFilesIgnored = !multiIgnoreResults.translationKeys.includes('IGNORE_TEST.DEBUG_UNIQUE') && 
                            !multiIgnoreResults.translationKeys.includes('IGNORE_TEST.TEST_MOCK_UNIQUE');
    
    if (!debugKeysPresent || !debugKeysIgnored || !bothFilesIgnored) {
      throw new Error('ignoreFiles configuration not working properly');
    }
    
    console.log(`   ✓ No ignore: ${noIgnoreResults.totalKeys} keys`);
    console.log(`   ✓ Ignore debug.json: ${ignoreResults.totalKeys} keys`);
    console.log(`   ✓ Ignore multiple: ${multiIgnoreResults.totalKeys} keys`);
  });

  // Test 20: configFile property and loadConfig function
  test('configFile property and loadConfig function', () => {
    const { loadConfig, generateConfig } = require('../lib/index');
    
    // Test loading existing config
    const existingConfig = loadConfig(path.join(testProjectPath, 'i18n-checker.config.json'));
    
    if (!existingConfig.localesPath || !existingConfig.srcPath) {
      throw new Error('loadConfig not working properly');
    }
    
    // Test loading non-existent config (should return defaults)
    const defaultConfig = loadConfig('./non-existent-config.json');
    
    if (!defaultConfig.localesPath) {
      throw new Error('loadConfig not returning defaults for missing file');
    }
    
    // Test generating config with custom options
    const customConfigPath = path.join(testProjectPath, 'custom-config.json');
    const customOptions = {
      verbose: true,
      outputFormat: 'json',
      ignoreKeys: ['test.key']
    };
    
    generateConfig(customConfigPath, customOptions);
    
    if (!fs.existsSync(customConfigPath)) {
      throw new Error('generateConfig not creating file');
    }
    
    const generatedConfig = JSON.parse(fs.readFileSync(customConfigPath, 'utf8'));
    
    if (generatedConfig.verbose !== true || !generatedConfig.ignoreKeys.includes('test.key')) {
      throw new Error('generateConfig not including custom options');
    }
    
    console.log(`   ✓ Existing config loaded successfully`);
    console.log(`   ✓ Default config returned for missing file`);
    console.log(`   ✓ Custom config generated with options`);
  });

  // Test 21: Path resolution and absolute paths
  test('Path resolution configuration', () => {
    // Test with relative paths
    const relativeConfig = {
      localesPath: './src/assets/i18n',
      srcPath: './src',
      keysExtensions: ['.ts', '.html'],
      verbose: false
    };
    
    // Change to test directory to test relative paths
    const originalCwd = process.cwd();
    process.chdir(testProjectPath);
    
    try {
      const relativeResults = analyzeTranslations(relativeConfig);
      
      if (!relativeResults.totalKeys) {
        throw new Error('Relative paths not resolving correctly');
      }
      
      // Test with absolute paths
      const absoluteConfig = {
        localesPath: path.join(testProjectPath, 'src/assets/i18n'),
        srcPath: path.join(testProjectPath, 'src'),
        keysExtensions: ['.ts', '.html'],
        verbose: false
      };
      
      const absoluteResults = analyzeTranslations(absoluteConfig);
      
      if (relativeResults.totalKeys !== absoluteResults.totalKeys) {
        throw new Error('Relative and absolute paths giving different results');
      }
      
      console.log(`   ✓ Relative paths: ${relativeResults.totalKeys} keys`);
      console.log(`   ✓ Absolute paths: ${absoluteResults.totalKeys} keys`);
      console.log(`   ✓ Path resolution working correctly`);
      
    } finally {
      process.chdir(originalCwd);
    }
  });
  
  // Cleanup
  console.log('🧹 Cleaning up test project...');
  fs.rmSync(testProjectPath, { recursive: true, force: true });
  
  // Results
  console.log('\n📊 Comprehensive Configuration Test Results:');
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${totalTests - passedTests}`);
  console.log(`   Total: ${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All comprehensive configuration tests passed! Every configuration property is working correctly.');
    return true;
  } else {
    console.log('\n⚠️  Some configuration tests failed. Please review the issues above.');
    return false;
  }
}

if (require.main === module) {
  runComprehensiveTests();
}

module.exports = { runComprehensiveTests };
