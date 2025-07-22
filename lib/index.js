const fs = require('fs');
const path = require('path');

// Default configuration
const defaultConfig = {
  localesPath: './src/assets/i18n',
  srcPath: './src',
  keysExtensions: ['.ts', '.html'],
  configFile: './i18n-checker.config.json',
  excludeDirs: ['node_modules', 'dist', '.git', '.angular', 'coverage'],
  outputFormat: 'console',
  exitOnIssues: false,
  verbose: false,
  // Ignore keys configuration
  ignoreKeys: [],
  ignorePatterns: [],
  ignoreRegex: [],
  ignoreFiles: []
};

/**
 * Load configuration from file if it exists
 */
function loadConfig(configPath = defaultConfig.configFile) {
  const resolvedPath = path.resolve(configPath);
  if (fs.existsSync(resolvedPath)) {
    try {
      const fileConfig = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      return { ...defaultConfig, ...fileConfig };
    } catch (error) {
      if (defaultConfig.verbose) {
        console.warn(`⚠️  Warning: Could not parse config file ${resolvedPath}. Using defaults.`);
      }
    }
  }
  return defaultConfig;
}

/**
 * Check if a key matches a wildcard pattern
 * Supports: *, **, and exact matches
 */
function matchesWildcard(key, pattern) {
  // Handle exact matches
  if (pattern === key) {
    return true;
  }
  
  // Convert wildcard pattern to regex
  let regexPattern = pattern;
  
  // Escape special regex characters except * and .
  regexPattern = regexPattern.replace(/[+?^${}()|[\]\\]/g, '\\$&');
  
  // Handle ** first (matches everything including dots)
  regexPattern = regexPattern.replace(/\*\*/g, '___DOUBLE_STAR___');
  
  // Handle single * (matches everything except dots)
  regexPattern = regexPattern.replace(/\*/g, '[^.]*');
  
  // Restore ** as .* (matches everything including dots)
  regexPattern = regexPattern.replace(/___DOUBLE_STAR___/g, '.*');
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(key);
}

/**
 * Check if a translation key should be ignored based on configuration
 */
function shouldIgnoreKey(key, config) {
  // 1. Check exact key matches
  if (config.ignoreKeys && config.ignoreKeys.includes(key)) {
    if (config.verbose) {
      console.log(`🚫 Ignoring key (exact match): ${key}`);
    }
    return true;
  }
  
  // 2. Check wildcard patterns
  if (config.ignorePatterns && config.ignorePatterns.length > 0) {
    for (const pattern of config.ignorePatterns) {
      if (matchesWildcard(key, pattern)) {
        if (config.verbose) {
          console.log(`🚫 Ignoring key (pattern "${pattern}"): ${key}`);
        }
        return true;
      }
    }
  }
  
  // 3. Check regex patterns
  if (config.ignoreRegex && config.ignoreRegex.length > 0) {
    for (const regexPattern of config.ignoreRegex) {
      try {
        const regex = new RegExp(regexPattern);
        if (regex.test(key)) {
          if (config.verbose) {
            console.log(`🚫 Ignoring key (regex "${regexPattern}"): ${key}`);
          }
          return true;
        }
      } catch (error) {
        console.warn(`⚠️  Warning: Invalid regex pattern "${regexPattern}": ${error.message}`);
      }
    }
  }
  
  return false;
}

/**
 * Check if a translation file should be ignored
 */
function shouldIgnoreFile(filename, config) {
  if (config.ignoreFiles && config.ignoreFiles.includes(filename)) {
    if (config.verbose) {
      console.log(`🚫 Ignoring translation file: ${filename}`);
    }
    return true;
  }
  return false;
}

/**
 * Get all translation keys from JSON files
 */
function getTranslationKeys(localesPath, config = defaultConfig) {
  const keys = new Set();
  const ignoredKeys = new Set();
  
  try {
    const localeFiles = fs.readdirSync(localesPath).filter(file => {
      if (!file.endsWith('.json')) return false;
      if (shouldIgnoreFile(file, config)) {
        return false;
      }
      return true;
    });
    
    if (localeFiles.length === 0) {
      console.warn(`⚠️  Warning: No translation files found in ${localesPath}`);
      return { keys, ignoredKeys };
    }
    
    if (config.verbose) {
      console.log(`📁 Found translation files: ${localeFiles.join(', ')}`);
    }
    
    localeFiles.forEach(file => {
      const filePath = path.join(localesPath, file);
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        function extractKeys(obj, prefix = '') {
          Object.keys(obj).forEach(key => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              extractKeys(obj[key], fullKey);
            } else {
              if (shouldIgnoreKey(fullKey, config)) {
                ignoredKeys.add(fullKey);
              } else {
                keys.add(fullKey);
              }
            }
          });
        }
        
        extractKeys(content);
        
        if (config.verbose) {
          console.log(`   📄 Processed ${file}`);
        }
      } catch (error) {
        console.warn(`⚠️  Warning: Could not parse ${file}: ${error.message}`);
      }
    });
  } catch (error) {
    console.error(`❌ Error: Could not read locales directory ${localesPath}: ${error.message}`);
    throw error;
  }
  
  return { keys, ignoredKeys };
}

/**
 * Find translation usage in source files
 */
function findTranslationUsage(srcPath, extensions = ['.ts', '.html'], config = defaultConfig) {
  const usedKeys = new Set();
  
  // Enhanced patterns to match translation usage
  const patterns = [
    /'([^']+)'\s*\|\s*translate/g,  // 'key' | translate
    /"([^"]+)"\s*\|\s*translate/g,  // "key" | translate
    /`([^`]+)`\s*\|\s*translate/g,  // `key` | translate
    /translate\.get\(['"`]([^'"`]+)['"`]\)/g,  // translate.get('key')
    /translate\.instant\(['"`]([^'"`]+)['"`]\)/g,  // translate.instant('key')
    /translateService\.get\(['"`]([^'"`]+)['"`]\)/g,  // translateService.get('key')
    /translateService\.instant\(['"`]([^'"`]+)['"`]\)/g,  // translateService.instant('key')
    /translationService\.translate\(['"`]([^'"`]+)['"`]\)/g,  // custom service
    /translationService\.instant\(['"`]([^'"`]+)['"`]\)/g,  // custom service
    /translationService\.get\(['"`]([^'"`]+)['"`]\)/g,  // custom service
  ];
  
  function searchInFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const key = match[1];
          if (key && key.trim()) {
            usedKeys.add(key.trim());
            if (config.verbose) {
              console.log(`   Found: ${key} in ${filePath}`);
            }
          }
        }
        pattern.lastIndex = 0; // Reset regex
      });
    } catch (error) {
      if (config.verbose) {
        console.warn(`⚠️  Warning: Could not read file ${filePath}: ${error.message}`);
      }
    }
  }
  
  function walkDirectory(dir) {
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        
        // Skip excluded directories
        if (config.excludeDirs && config.excludeDirs.some(excludeDir => filePath.includes(excludeDir))) {
          return;
        }
        
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDirectory(filePath);
        } else if (extensions.some(ext => file.endsWith(ext))) {
          searchInFile(filePath);
        }
      });
    } catch (error) {
      if (config.verbose) {
        console.warn(`⚠️  Warning: Could not read directory ${dir}: ${error.message}`);
      }
    }
  }
  
  if (config.verbose) {
    console.log(`🔍 Searching for translations in: ${srcPath}`);
  }
  
  walkDirectory(srcPath);
  return usedKeys;
}

/**
 * Format output based on specified format
 */
function formatOutput(results, format = 'console') {
  switch (format) {
    case 'json':
      return JSON.stringify(results, null, 2);
    case 'csv':
      return formatCSV(results);
    case 'console':
    default:
      return formatConsole(results);
  }
}

function formatCSV(results) {
  const lines = ['Type,Key,Status'];
  
  results.unusedKeys.forEach(key => {
    lines.push(`unused,"${key}",unused`);
  });
  
  results.missingKeys.forEach(key => {
    lines.push(`missing,"${key}",missing`);
  });
  
  return lines.join('\n');
}

function formatConsole(results) {
  let output = '';
  
  output += '🔍 Analyzing translations...\n\n';
  output += `📊 Translation Analysis Results:\n`;
  output += `   Total translation keys: ${results.totalKeys}\n`;
  output += `   Used keys: ${results.usedKeysCount}\n`;
  
  if (results.ignoredKeysCount > 0) {
    output += `   Ignored keys: ${results.ignoredKeysCount}\n`;
  }
  
  output += `   Unused keys: ${results.unusedKeys.length}\n`;
  output += `   Missing keys: ${results.missingKeys.length}\n\n`;
  
  if (results.ignoredKeys && results.ignoredKeys.length > 0) {
    output += '🚫 Ignored translation keys:\n';
    
    // Group ignored keys by pattern for better readability
    const ignorePatterns = results.config.ignorePatterns || [];
    const ignoreKeys = results.config.ignoreKeys || [];
    
    if (ignoreKeys.length > 0) {
      output += '   📍 Exact matches:\n';
      ignoreKeys.forEach(pattern => {
        const matchingKeys = results.ignoredKeys.filter(key => key === pattern);
        if (matchingKeys.length > 0) {
          output += `      "${pattern}": ${matchingKeys.length} key(s)\n`;
        }
      });
    }
    
    if (ignorePatterns.length > 0) {
      output += '   🎯 Pattern matches:\n';
      ignorePatterns.forEach(pattern => {
        const matchingKeys = results.ignoredKeys.filter(key => {
          return matchesWildcard(key, pattern);
        });
        if (matchingKeys.length > 0) {
          output += `      "${pattern}": ${matchingKeys.length} key(s)\n`;
          if (results.config.verbose) {
            matchingKeys.forEach(key => output += `         - ${key}\n`);
          }
        }
      });
    }
    
    output += '\n';
  }
  
  if (results.unusedKeys.length > 0) {
    output += '🚨 Unused translation keys:\n';
    results.unusedKeys.forEach(key => output += `   - ${key}\n`);
    output += '\n';
  }
  
  if (results.missingKeys.length > 0) {
    output += '⚠️  Missing translation keys:\n';
    results.missingKeys.forEach(key => output += `   - ${key}\n`);
    output += '\n';
  }
  
  if (results.unusedKeys.length === 0 && results.missingKeys.length === 0) {
    output += '✅ All translations are properly used!\n';
  }
  
  return output;
}

/**
 * Auto-detect Angular project structure
 */
function detectProjectStructure(basePath = process.cwd()) {
  const possiblePaths = [
    './src/assets/i18n',
    './src/assets/locales',
    './public/i18n',
    './assets/i18n',
    './i18n',
    './locales'
  ];
  
  for (const possiblePath of possiblePaths) {
    const fullPath = path.resolve(basePath, possiblePath);
    if (fs.existsSync(fullPath)) {
      return possiblePath;
    }
  }
  
  return null;
}

/**
 * Main analysis function
 */
function analyzeTranslations(options = {}) {
  const config = { ...defaultConfig, ...options };
  
  // Auto-detect project structure if not specified
  if (!options.localesPath) {
    const detectedPath = detectProjectStructure();
    if (detectedPath) {
      config.localesPath = detectedPath;
      if (config.verbose) {
        console.log(`🔍 Auto-detected translation path: ${detectedPath}`);
      }
    }
  }
  
  // Resolve paths
  config.localesPath = path.resolve(config.localesPath);
  config.srcPath = path.resolve(config.srcPath);
  
  if (config.verbose) {
    console.log('📝 Configuration:', JSON.stringify(config, null, 2));
  }
  
  const { keys: translationKeys, ignoredKeys } = getTranslationKeys(config.localesPath, config);
  const usedKeys = findTranslationUsage(config.srcPath, config.keysExtensions, config);
  
  const unusedKeys = [...translationKeys].filter(key => !usedKeys.has(key));
  const missingKeys = [...usedKeys].filter(key => !translationKeys.has(key));
  
  const results = {
    totalKeys: translationKeys.size,
    usedKeysCount: usedKeys.size,
    ignoredKeysCount: ignoredKeys.size,
    unusedKeys: unusedKeys.sort(),
    missingKeys: missingKeys.sort(),
    ignoredKeys: [...ignoredKeys].sort(),
    translationKeys: [...translationKeys].sort(),
    usedKeys: [...usedKeys].sort(),
    config: config
  };
  
  return results;
}

/**
 * Generate default configuration file
 */
function generateConfig(outputPath = './i18n-checker.config.json', options = {}) {
  const detectedLocalesPath = detectProjectStructure();
  const config = {
    localesPath: detectedLocalesPath || './src/assets/i18n',
    srcPath: './src',
    keysExtensions: ['.ts', '.html'],
    excludeDirs: ['node_modules', 'dist', '.git', '.angular', 'coverage'],
    outputFormat: 'console',
    exitOnIssues: false,
    verbose: false,
    ...options
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
  console.log(`✅ Generated configuration file: ${outputPath}`);
  
  if (detectedLocalesPath) {
    console.log(`🔍 Auto-detected translation path: ${detectedLocalesPath}`);
  }
  
  return config;
}

module.exports = {
  analyzeTranslations,
  getTranslationKeys,
  findTranslationUsage,
  loadConfig,
  formatOutput,
  detectProjectStructure,
  generateConfig,
  defaultConfig
};
