#!/usr/bin/env node

import { analyzeTranslations } from '../src/index';
import { AnalysisConfig, OutputFormat, OutputSection } from '../src/types';

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
  console.log(`
Angular Translation Checker v2.0.0 (TypeScript Edition)

USAGE:
  ng-i18n-check [options]

OPTIONS:
  -l, --locales-path <path>    Path to translation files directory
  -s, --src-path <path>        Path to source code directory  
  -f, --format <format>        Output format (console|json|csv)
  -o, --output <sections>      Output sections (comma-separated)
  -c, --config <path>          Configuration file path
  --ignore-keys <patterns>     Ignore key patterns (comma-separated)
  --languages <langs>          Specific languages to check (comma-separated)
  --exit-on-issues            Exit with error code if issues found
  -v, --verbose               Enable verbose logging
  --generate-config           Generate default configuration file
  --help, -h                  Show this help message
  --version                   Show version information

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
  ng-i18n-check                                    # Basic analysis
  ng-i18n-check --output summary,unused,missing   # Specific sections
  ng-i18n-check --format json --verbose           # JSON output with verbose logging
  ng-i18n-check --config ./my-config.json         # Use custom configuration
  ng-i18n-check --generate-config                 # Generate configuration file

For more information and examples, visit:
https://ricardoferreirades.github.io/angular-translation-checker/
`);
}

function showVersion(): void {
  const packageJson = require('../package.json');
  console.log(`Angular Translation Checker v${packageJson.version} (TypeScript Edition)`);
  console.log('A modern, plugin-based translation analysis tool for Angular projects.');
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
    const { ConfigurationManager } = await import('../src/core/config-manager');
    const { ConsoleLogger } = await import('../src/core/logger');
    
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
    const result = await analyzeTranslations(options.config);
    
    // Print output
    console.log(result.output);
    
    // Exit with appropriate code
    if (options.exitOnIssues && result.hasIssues) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the CLI
if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}
