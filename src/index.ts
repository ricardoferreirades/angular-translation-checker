// Main entry point for the TypeScript version
export * from './types';
export * from './core/translation-checker';
export * from './core/config-manager';
export * from './core/plugin-manager';
export * from './core/logger';
export * from './core/event-bus';
export * from './core/filesystem';

// Built-in plugins
export * from './plugins/extractors/typescript-extractor';
export * from './plugins/extractors/html-extractor';
export * from './plugins/analyzers/core-analyzer';
export * from './plugins/formatters/console-formatter';

import { TranslationChecker } from './core/translation-checker';
import { TypeScriptExtractor } from './plugins/extractors/typescript-extractor';
import { HtmlExtractor } from './plugins/extractors/html-extractor';
import { CoreAnalyzer } from './plugins/analyzers/core-analyzer';
import { ConsoleFormatter } from './plugins/formatters/console-formatter';
import { JsonFormatter } from './plugins/formatters/json-formatter';
import { HtmlFormatter } from './plugins/formatters/html-formatter';
import { AnalysisConfig } from './types';

/**
 * Create a new translation checker instance with built-in plugins
 */
export async function createTranslationChecker(): Promise<TranslationChecker> {
  const checker = new TranslationChecker();
  
  // We'll register built-in plugins during initialization
  return checker;
}

/**
 * Register built-in plugins with a translation checker instance
 */
export async function registerBuiltInPlugins(
  checker: TranslationChecker,
  config: any
): Promise<void> {
  const pluginManager = (checker as any).pluginManager;
  
  // Register extractors
  await pluginManager.registerPlugin(new TypeScriptExtractor(), config);
  await pluginManager.registerPlugin(new HtmlExtractor(), config);
  
  // Register analyzer
  await pluginManager.registerPlugin(new CoreAnalyzer(), config);
  
  // Register formatters
  await pluginManager.registerPlugin(new ConsoleFormatter(), config);
  await pluginManager.registerPlugin(new JsonFormatter(), config);
  await pluginManager.registerPlugin(new HtmlFormatter(), config);
}

/**
 * Convenience function for quick analysis
 */
export async function analyzeTranslations(configPath?: string, configOverrides?: Partial<AnalysisConfig>) {
  const checker = await createTranslationChecker();
  
  try {
    // Initialize with configuration and overrides
    const config = await checker.initialize(configPath, configOverrides);
    
    // Register built-in plugins
    await registerBuiltInPlugins(checker, config);
    
    // Run analysis
    const result = await checker.analyze(config);
    
    // Format output
    const output = await checker.format(
      result, 
      config.outputFormat || 'console',
      config.outputSections || ['summary', 'unused', 'missing']
    );
    
    // Generate reports
    await checker.report(result, output);
    
    return {
      result,
      output,
      hasIssues: result.unusedKeys.length > 0 || result.missingKeys.length > 0
    };
    
  } finally {
    await checker.cleanup();
  }
}
