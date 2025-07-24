#!/usr/bin/env node

const {
  analyzeTranslations,
  loadConfig,
  formatOutput,
  generateConfig,
  defaultConfig
} = require('../lib/index');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '--locales-path':
      case '-l':
        options.localesPath = nextArg;
        i++;
        break;
      case '--src-path':
      case '-s':
        options.srcPath = nextArg;
        i++;
        break;
      case '--format':
      case '-f':
        options.outputFormat = nextArg;
        i++;
        break;
      case '--output':
      case '-o':
        if (nextArg && !nextArg.startsWith('--')) {
          options.outputSections = nextArg.split(',').map(s => s.trim());
          i++;
        }
        break;
      case '--config':
      case '-c':
        options.configFile = nextArg;
        i++;
        break;
      case '--ignore-keys':
        if (nextArg && !nextArg.startsWith('--')) {
          options.ignoreKeys = nextArg.split(',').map(k => k.trim());
          i++;
        }
        break;
      case '--ignore-patterns':
        if (nextArg && !nextArg.startsWith('--')) {
          options.ignorePatterns = nextArg.split(',').map(p => p.trim());
          i++;
        }
        break;
      case '--ignore-files':
        if (nextArg && !nextArg.startsWith('--')) {
          options.ignoreFiles = nextArg.split(',').map(f => f.trim());
          i++;
        }
        break;
      case '--exit-on-issues':
        options.exitOnIssues = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--init':
        return { command: 'init', options };
      case '--version':
        return { command: 'version' };
      case '--help':
      case '-h':
        return { command: 'help' };
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
    }
  }
  
  return { command: 'analyze', options };
}

function showHelp() {
  console.log(`
🔍 Angular Translation Checker v1.0.0

A comprehensive tool for analyzing translation keys in Angular projects using ngx-translate.

Usage: ng-i18n-check [options] [command]

Commands:
  analyze                          Analyze translations (default)
  init                             Generate configuration file
  --version                        Show version
  --help                           Show this help

Options:
  -l, --locales-path <path>        Path to translation files
  -s, --src-path <path>            Path to source files
  -f, --format <format>            Output format: console, json, csv
  -o, --output <sections>          Output sections: summary,dynamicPatterns,ignored,unused,missing,usedKeys,translationKeys,config
  -c, --config <path>              Config file path
  --ignore-keys <keys>             Comma-separated list of keys to ignore
  --ignore-patterns <patterns>     Comma-separated list of wildcard patterns to ignore
  --ignore-files <files>           Comma-separated list of translation files to ignore
  --exit-on-issues                 Exit with non-zero code if issues found
  -v, --verbose                    Verbose output

Examples:
  ng-i18n-check                                    # Analyze with auto-detection
  ng-i18n-check --init                            # Generate config file
  ng-i18n-check --locales-path ./assets/i18n      # Custom translation path
  ng-i18n-check --format json > report.json       # JSON output
  ng-i18n-check --output summary,unused           # Show only summary and unused keys
  ng-i18n-check --output ignored,missing          # Show only ignored and missing keys
  ng-i18n-check --exit-on-issues                  # For CI/CD pipelines
  ng-i18n-check --verbose                         # Detailed output
  ng-i18n-check --ignore-keys "debug.api,temp.test"     # Ignore specific keys
  ng-i18n-check --ignore-patterns "debug.*,*.test"      # Ignore key patterns
  ng-i18n-check --ignore-files "debug-translations.json" # Ignore translation files

Output Sections:
  summary          Translation statistics and counts
  dynamicPatterns  Keys matched by dynamic patterns
  ignored          Keys that are ignored by patterns/config
  unused           Keys that exist in translations but aren't used
  missing          Keys that are used in code but missing from translations
  usedKeys         All keys found in the codebase (verbose)
  translationKeys  All keys from translation files (verbose)
  config           Configuration used for analysis (verbose)

Ignore Patterns:
  * matches within a segment (no dots)
  ** matches across segments (including dots)
  Examples:
    "debug.*" matches "debug.api" but not "debug.api.request"
    "debug.**" matches "debug.api", "debug.api.request", etc.
    "*.test" matches "user.test", "admin.test", etc.

Auto-detection:
  The tool automatically detects common Angular translation folder structures:
  - ./src/assets/i18n
  - ./src/assets/locales  
  - ./public/i18n
  - ./assets/i18n

Configuration:
  Use --init to generate a configuration file, or create i18n-checker.config.json manually.

For more information, visit: https://github.com/ricardoferreirades/angular-translation-checker
`);
}

function showVersion() {
  const pkg = require('../package.json');
  console.log(`angular-translation-checker v${pkg.version}`);
}

// Main execution
function main() {
  const parsed = parseArgs();
  
  switch (parsed.command) {
    case 'help':
      showHelp();
      break;
      
    case 'version':
      showVersion();
      break;
      
    case 'init':
      try {
        generateConfig('./i18n-checker.config.json', parsed.options);
      } catch (error) {
        console.error(`❌ Error generating config: ${error.message}`);
        process.exit(1);
      }
      break;
      
    case 'analyze':
    default:
      try {
        // Load configuration
        const fileConfig = parsed.options.configFile ? 
          loadConfig(parsed.options.configFile) : 
          loadConfig();
        const config = { ...fileConfig, ...parsed.options };
        
        // Run analysis
        const results = analyzeTranslations(config);
        
        // Output results with selected sections
        const outputSections = config.outputSections || null;
        const output = formatOutput(results, config.outputFormat, outputSections);
        
        if (config.outputFormat === 'console') {
          console.log(output);
        } else {
          console.log(output);
        }
        
        // Exit with error code if issues found and configured to do so
        if (config.exitOnIssues && (results.unusedKeys.length > 0 || results.missingKeys.length > 0)) {
          process.exit(1);
        }
        
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        if (parsed.options.verbose) {
          console.error(error.stack);
        }
        process.exit(1);
      }
      break;
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the CLI
if (require.main === module) {
  main();
}

module.exports = { parseArgs, showHelp, showVersion, main };
