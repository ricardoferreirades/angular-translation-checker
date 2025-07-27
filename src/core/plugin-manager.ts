import {
  Plugin,
  PluginContext,
  AnalyzerPlugin,
  ExtractorPlugin,
  FormatterPlugin,
  ValidatorPlugin,
  ReporterPlugin,
  PluginError,
  Logger,
  EventBus,
  AnalysisConfig
} from '../types';

export class PluginManager {
  private plugins = new Map<string, Plugin>();
  private analyzers = new Map<string, AnalyzerPlugin>();
  private extractors = new Map<string, ExtractorPlugin>();
  private formatters = new Map<string, FormatterPlugin>();
  private validators = new Map<string, ValidatorPlugin>();
  private reporters = new Map<string, ReporterPlugin>();

  constructor(
    private logger: Logger,
    private eventBus: EventBus
  ) {}

  async registerPlugin(plugin: Plugin, config: AnalysisConfig): Promise<void> {
    try {
      this.logger.debug(`Registering plugin: ${plugin.name} v${plugin.version}`);
      
      // Check for name conflicts
      if (this.plugins.has(plugin.name)) {
        throw new PluginError(
          `Plugin with name '${plugin.name}' is already registered`,
          plugin.name
        );
      }

      // Create plugin context
      const context: PluginContext = {
        config,
        logger: this.logger,
        eventBus: this.eventBus
      };

      // Initialize plugin
      await plugin.initialize(context);

      // Register plugin by type
      this.plugins.set(plugin.name, plugin);
      
      if (this.isAnalyzerPlugin(plugin)) {
        this.analyzers.set(plugin.name, plugin);
      }
      
      if (this.isExtractorPlugin(plugin)) {
        this.extractors.set(plugin.name, plugin);
      }
      
      if (this.isFormatterPlugin(plugin)) {
        this.formatters.set(plugin.outputFormat, plugin);
      }
      
      if (this.isValidatorPlugin(plugin)) {
        this.validators.set(plugin.name, plugin);
      }
      
      if (this.isReporterPlugin(plugin)) {
        this.reporters.set(plugin.name, plugin);
      }

      this.logger.info(`Successfully registered plugin: ${plugin.name}`);
      this.eventBus.emit('plugin:registered', { plugin: plugin.name });

    } catch (error) {
      const pluginError = error instanceof PluginError 
        ? error 
        : new PluginError(`Failed to register plugin '${plugin.name}': ${error}`, plugin.name);
      
      this.logger.error(pluginError.message);
      throw pluginError;
    }
  }

  async unregisterPlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new PluginError(`Plugin '${pluginName}' is not registered`, pluginName);
    }

    try {
      // Cleanup plugin
      if (plugin.cleanup) {
        await plugin.cleanup();
      }

      // Remove from all registries
      this.plugins.delete(pluginName);
      this.analyzers.delete(pluginName);
      this.extractors.delete(pluginName);
      this.validators.delete(pluginName);
      this.reporters.delete(pluginName);

      // Remove formatters by format
      for (const [format, formatter] of this.formatters.entries()) {
        if (formatter.name === pluginName) {
          this.formatters.delete(format);
          break;
        }
      }

      this.logger.info(`Successfully unregistered plugin: ${pluginName}`);
      this.eventBus.emit('plugin:unregistered', { plugin: pluginName });

    } catch (error) {
      const pluginError = new PluginError(
        `Failed to unregister plugin '${pluginName}': ${error}`,
        pluginName
      );
      this.logger.error(pluginError.message);
      throw pluginError;
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAnalyzers(): AnalyzerPlugin[] {
    return Array.from(this.analyzers.values());
  }

  getExtractors(): ExtractorPlugin[] {
    return Array.from(this.extractors.values());
  }

  getExtractorByExtension(extension: string): ExtractorPlugin[] {
    return Array.from(this.extractors.values()).filter(
      extractor => extractor.supportedExtensions.includes(extension)
    );
  }

  getFormatter(format: string): FormatterPlugin | undefined {
    return this.formatters.get(format);
  }

  getValidators(): ValidatorPlugin[] {
    return Array.from(this.validators.values());
  }

  getReporters(): ReporterPlugin[] {
    return Array.from(this.reporters.values());
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getPluginCount(): number {
    return this.plugins.size;
  }

  async cleanup(): Promise<void> {
    const pluginNames = Array.from(this.plugins.keys());
    
    for (const pluginName of pluginNames) {
      try {
        await this.unregisterPlugin(pluginName);
      } catch (error) {
        this.logger.error(`Error cleaning up plugin '${pluginName}': ${error}`);
      }
    }
  }

  // Type guards
  private isAnalyzerPlugin(plugin: Plugin): plugin is AnalyzerPlugin {
    return 'analyze' in plugin && typeof plugin.analyze === 'function';
  }

  private isExtractorPlugin(plugin: Plugin): plugin is ExtractorPlugin {
    return 'supportedExtensions' in plugin && 'extractKeys' in plugin;
  }

  private isFormatterPlugin(plugin: Plugin): plugin is FormatterPlugin {
    return 'outputFormat' in plugin && 'format' in plugin;
  }

  private isValidatorPlugin(plugin: Plugin): plugin is ValidatorPlugin {
    return 'validate' in plugin && typeof plugin.validate === 'function';
  }

  private isReporterPlugin(plugin: Plugin): plugin is ReporterPlugin {
    return 'report' in plugin && typeof plugin.report === 'function';
  }
}
