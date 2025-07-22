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
      case '--config':
      case '-c':
        options.configFile = nextArg;
        i++;
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
  -c, --config <path>              Config file path
  --exit-on-issues                 Exit with non-zero code if issues found
  -v, --verbose                    Verbose output

Examples:
  ng-i18n-check                                    # Analyze with auto-detection
  ng-i18n-check --init                            # Generate config file
  ng-i18n-check --locales-path ./assets/i18n      # Custom translation path
  ng-i18n-check --format json > report.json       # JSON output
  ng-i18n-check --exit-on-issues                  # For CI/CD pipelines
  ng-i18n-check --verbose                         # Detailed output

Auto-detection:
  The tool automatically detects common Angular translation folder structures:
  - ./src/assets/i18n
  - ./src/assets/locales  
  - ./public/i18n
  - ./assets/i18n

Configuration:
  Use --init to generate a configuration file, or create i18n-checker.config.json manually.

For more information, visit: https://github.com/yourusername/angular-translation-checker
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
        
        // Output results
        const output = formatOutput(results, config.outputFormat);
        
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
