#!/usr/bin/env node

import { analyzeTranslations } from './index';
import { AnalysisConfig, OutputFormat, OutputSection } from './types';

interface CLIOptions {
  localesPath?: string;
  srcPath?: string;
  format?: OutputFormat;
  output?: string;
  config?: string;
  ignoreKeys?: string;
  languages?: string;
  exitOnIssues?: boolean;
  verbose?: boolean;
  generateConfig?: boolean;
  help?: boolean;
  version?: boolean;
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {};
  
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
        options.format = nextArg as OutputFormat;
        i++;
        break;
      case '--output':
      case '-o':
        if (nextArg && !nextArg.startsWith('--')) {
          options.output = nextArg;
          i++;
        }
        break;
      case '--config':
      case '-c':
        options.config = nextArg;
        i++;
        break;
      case '--ignore-keys':
        if (nextArg && !nextArg.startsWith('--')) {
          options.ignoreKeys = nextArg;
          i++;
        }
        break;
      case '--languages':
        if (nextArg && !nextArg.startsWith('--')) {
          options.languages = nextArg;
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
      case '--generate-config':
        options.generateConfig = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--version':
        options.version = true;
        break;
    }
  }
  
  return options;
}

function showHelp(): void {
  const packageJson = require('../package.json');
  console.log(`
Angular Translation Checker v${packageJson.version} (TypeScript Edition)

USAGE:
  ng-i18n-check [options]

OPTIONS:
  -l, --locales-path <path>    Path to translation files directory (default: ./src/assets/i18n)
  -s, --src-path <path>        Path to source code directory (default: ./src)
  -f, --format <format>        Output format: console, json, csv (default: console)
  -o, --output <sections>      Output sections (comma-separated, see below)
  -c, --config <path>          Configuration file path (default: ./.ng-i18n-check.json)
  --ignore-keys <patterns>     Ignore key patterns (comma-separated regex patterns)
  --languages <langs>          Specific languages to check (comma-separated, e.g., en,es,fr)
  --exit-on-issues            Exit with error code if translation issues are found
  -v, --verbose               Enable verbose logging and detailed output
  --generate-config           Generate a default configuration file
  --help, -h                  Show this comprehensive help message
  --version                   Show version information and credits

OUTPUT SECTIONS:
  summary          Analysis summary with counts and coverage
  dynamicPatterns  Dynamic key patterns detected
  ignored          Keys ignored by configuration
  unused           Translation keys not used in source code
  missing          Keys used in source but missing from translations
  usedKeys         All keys found in source code
  translationKeys  All available translation keys
  config           Current configuration settings

EXAMPLES:
  # Basic analysis with default settings
  ng-i18n-check

  # Analyze specific paths with verbose output
  ng-i18n-check -l ./assets/i18n -s ./src -v

  # Show only critical information (unused and missing keys)
  ng-i18n-check --output summary,unused,missing

  # Generate JSON report and save to file
  ng-i18n-check --format json --output summary,unused > translation-report.json

  # Check only specific languages with custom config
  ng-i18n-check --languages en,es --config ./my-i18n-config.json

  # CI/CD: Exit with error if issues found
  ng-i18n-check --exit-on-issues --output summary

  # Generate configuration file for your project
  ng-i18n-check --generate-config

  # Ignore specific key patterns (useful for dynamic keys)
  ng-i18n-check --ignore-keys "DYNAMIC_.*,TEST_.*"

COMMON WORKFLOWS:
  1. First time setup:     ng-i18n-check --generate-config
  2. Regular analysis:     ng-i18n-check
  3. Detailed inspection:  ng-i18n-check -v --output summary,unused,missing
  4. CI/CD integration:    ng-i18n-check --exit-on-issues --format json

For more information and examples, visit:
https://ricardoferreirades.github.io/angular-translation-checker/
`);
}

function showVersion(): void {
  const packageJson = require('../package.json');
  console.log(`
┌─ Angular Translation Checker ─────────────────────────────────┐
│ Version: ${packageJson.version} (TypeScript Edition)                     │
│ A modern, plugin-based translation analysis tool             │
│                                                               │
│ Features:                                                     │
│ • TypeScript-first architecture with full type safety        │
│ • Extensible plugin system for custom analysis               │
│ • Multiple output formats (Console, JSON, CSV, HTML)         │
│ • Advanced pattern matching and dynamic key detection        │
│ • CI/CD integration with configurable exit codes             │
│                                                               │
│ Repository: https://github.com/ricardoferreirades/angular-translation-checker │
│ Documentation: https://ricardoferreirades.github.io/angular-translation-checker/ │
└───────────────────────────────────────────────────────────────┘
`);
}

async function main(): Promise<void> {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  if (options.version) {
    showVersion();
    return;
  }
  
  if (options.generateConfig) {
    const { ConfigurationManager } = await import('./core/config-manager');
    const { ConsoleLogger } = await import('./core/logger');
    
    const configManager = new ConfigurationManager(new ConsoleLogger(true));
    await configManager.generateConfigFile();
    console.log('Configuration file generated successfully!');
    return;
  }
  
  try {
    // Merge CLI options with any existing config
    const configOverrides: Partial<AnalysisConfig> = {};
    
    if (options.localesPath) configOverrides.localesPath = options.localesPath;
    if (options.srcPath) configOverrides.srcPath = options.srcPath;
    if (options.format) configOverrides.outputFormat = options.format;
    if (options.verbose !== undefined) configOverrides.verbose = options.verbose;
    if (options.exitOnIssues !== undefined) configOverrides.exitOnIssues = options.exitOnIssues;
    
    if (options.output) {
      configOverrides.outputSections = options.output.split(',')
        .map(s => s.trim()) as OutputSection[];
    }
    
    if (options.ignoreKeys) {
      configOverrides.ignoreKeys = options.ignoreKeys.split(',')
        .map(k => k.trim());
    }
    
    if (options.languages) {
      configOverrides.languages = options.languages.split(',')
        .map(l => l.trim());
    }
    
    // Run analysis
    const result = await analyzeTranslations(options.config, configOverrides);
    
    // Print output
    console.log(result.output);
    
    // Exit with appropriate code
    if (options.exitOnIssues && result.hasIssues) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Analysis Error:');
    
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      
      // Provide helpful suggestions based on common error types
      if (error.message.includes('ENOENT') || error.message.includes('not found')) {
        console.error('\n💡 Suggestions:');
        console.error('   • Check that the specified paths exist');
        console.error('   • Use --locales-path and --src-path to specify correct directories');
        console.error('   • Run --generate-config to create a default configuration');
      } else if (error.message.includes('permission')) {
        console.error('\n💡 Suggestions:');
        console.error('   • Check file permissions for the specified directories');
        console.error('   • Ensure you have read access to translation files');
      } else if (error.message.includes('JSON') || error.message.includes('parse')) {
        console.error('\n💡 Suggestions:');
        console.error('   • Check that translation files contain valid JSON');
        console.error('   • Use --verbose for detailed parsing information');
      }
      
      if (options.verbose && error.stack) {
        console.error('\n🔍 Stack trace (verbose mode):');
        console.error(error.stack);
      }
    } else {
      console.error(`   ${String(error)}`);
    }
    
    console.error('\n📖 For help and examples, run: ng-i18n-check --help');
    process.exit(1);
  }
}

// Run the CLI
if (require.main === module) {
  main().catch(error => {
    console.error('\n💥 Unexpected Error:');
    console.error(`   ${error.message || String(error)}`);
    console.error('\n📝 This appears to be an unexpected error. Please consider:');
    console.error('   • Reporting this issue at: https://github.com/ricardoferreirades/angular-translation-checker/issues');
    console.error('   • Including your configuration and command used');
    console.error('   • Running with --verbose for more details');
    process.exit(1);
  });
}
