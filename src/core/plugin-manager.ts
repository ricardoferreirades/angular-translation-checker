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

/**
 * Manages the registration, retrieval, and lifecycle of plugins (analyzers, extractors, validators, formatters, reporters)
 * for the translation checker. Handles both built-in and custom plugins, and provides plugin lookup for analysis steps.
 */
export class PluginManager {
  private plugins = new Map<string, Plugin>();
  private analyzers = new Map<string, AnalyzerPlugin>();
  private extractors = new Map<string, ExtractorPlugin>();
  private formatters = new Map<string, FormatterPlugin>();
  private validators = new Map<string, ValidatorPlugin>();
  private reporters = new Map<string, ReporterPlugin>();


  /**
   * Creates a new PluginManager.
   * @param {Logger} logger - Logger instance for debug and error output.
   * @param {EventBus} eventBus - Event bus for plugin lifecycle events.
   */
  constructor(
    private logger: Logger,
    private eventBus: EventBus
  ) {}

  /**
   * Registers a plugin, initializes it, and adds it to the appropriate registries by type.
   * Emits events and logs registration status.
   * @param {Plugin} plugin - The plugin to register.
   * @param {AnalysisConfig} config - The analysis configuration for plugin context.
   * @returns {Promise<void>}
   * @throws {PluginError} If registration fails or plugin is invalid.
   */
  async registerPlugin(plugin: Plugin, config: AnalysisConfig): Promise<void> {
    try {
      if (!plugin || typeof plugin !== 'object' || typeof plugin.name !== 'string' || !plugin.name.trim()) {
        throw new PluginError('Plugin must have a valid name property', plugin?.name ?? 'unknown');
      }
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
        : new PluginError(`Failed to register plugin '${plugin?.name ?? 'unknown'}': ${error}`, plugin?.name ?? 'unknown');

      this.logger.error(pluginError.message);
      throw pluginError;
    }
  }

  /**
   * Unregisters a plugin by name, cleaning up and removing from all registries.
   * Emits events and logs unregistration status.
   * @param {string} pluginName - The name of the plugin to unregister.
   * @returns {Promise<void>}
   * @throws {PluginError} If the plugin is not registered or cleanup fails.
   */
  async unregisterPlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      const pluginError = new PluginError(`Plugin '${pluginName}' is not registered`, pluginName);
      this.logger.error(pluginError.message);
      throw pluginError;
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

  /**
   * Retrieves a plugin by name.
   * @param {string} name - The plugin name.
   * @returns {Plugin | undefined} The plugin instance, or undefined if not found.
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Returns all registered analyzer plugins.
   * @returns {AnalyzerPlugin[]} Array of analyzer plugins.
   */
  getAnalyzers(): AnalyzerPlugin[] {
    return Array.from(this.analyzers.values());
  }

  /**
   * Returns all registered extractor plugins.
   * @returns {ExtractorPlugin[]} Array of extractor plugins.
   */
  getExtractors(): ExtractorPlugin[] {
    return Array.from(this.extractors.values());
  }

  /**
   * Returns all extractor plugins supporting a given file extension.
   * @param {string} extension - The file extension (e.g., ".ts").
   * @returns {ExtractorPlugin[]} Array of matching extractor plugins.
   */
  getExtractorByExtension(extension: string): ExtractorPlugin[] {
    return Array.from(this.extractors.values()).filter(
      extractor => extractor.supportedExtensions.includes(extension)
    );
  }

  /**
   * Retrieves a formatter plugin by output format.
   * @param {string} format - The output format (e.g., "json").
   * @returns {FormatterPlugin | undefined} The formatter plugin, or undefined if not found.
   */
  getFormatter(format: string): FormatterPlugin | undefined {
    return this.formatters.get(format);
  }

  /**
   * Returns all registered validator plugins.
   * @returns {ValidatorPlugin[]} Array of validator plugins.
   */
  getValidators(): ValidatorPlugin[] {
    return Array.from(this.validators.values());
  }

  /**
   * Returns all registered reporter plugins.
   * @returns {ReporterPlugin[]} Array of reporter plugins.
   */
  getReporters(): ReporterPlugin[] {
    return Array.from(this.reporters.values());
  }

  /**
   * Returns all registered plugins of any type.
   * @returns {Plugin[]} Array of all plugins.
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Returns the total number of registered plugins.
   * @returns {number} Plugin count.
   */
  getPluginCount(): number {
    return this.plugins.size;
  }

  /**
   * Unregisters and cleans up all registered plugins.
   * Logs errors for any failures during cleanup.
   * @returns {Promise<void>}
   */
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
  /**
   * Type guard: Checks if a plugin is an AnalyzerPlugin.
   * @param {Plugin} plugin - The plugin to check.
   * @returns {boolean} True if AnalyzerPlugin.
   * @private
   */
  private isAnalyzerPlugin(plugin: Plugin): plugin is AnalyzerPlugin {
    return 'analyze' in plugin && typeof plugin.analyze === 'function';
  }

  /**
   * Type guard: Checks if a plugin is an ExtractorPlugin.
   * @param {Plugin} plugin - The plugin to check.
   * @returns {boolean} True if ExtractorPlugin.
   * @private
   */
  private isExtractorPlugin(plugin: Plugin): plugin is ExtractorPlugin {
    return 'supportedExtensions' in plugin && 'extractKeys' in plugin;
  }

  /**
   * Type guard: Checks if a plugin is a FormatterPlugin.
   * @param {Plugin} plugin - The plugin to check.
   * @returns {boolean} True if FormatterPlugin.
   * @private
   */
  private isFormatterPlugin(plugin: Plugin): plugin is FormatterPlugin {
    return 'outputFormat' in plugin && 'format' in plugin;
  }

  /**
   * Type guard: Checks if a plugin is a ValidatorPlugin.
   * @param {Plugin} plugin - The plugin to check.
   * @returns {boolean} True if ValidatorPlugin.
   * @private
   */
  private isValidatorPlugin(plugin: Plugin): plugin is ValidatorPlugin {
    return 'validate' in plugin && typeof plugin.validate === 'function';
  }

  /**
   * Type guard: Checks if a plugin is a ReporterPlugin.
   * @param {Plugin} plugin - The plugin to check.
   * @returns {boolean} True if ReporterPlugin.
   * @private
   */
  private isReporterPlugin(plugin: Plugin): plugin is ReporterPlugin {
    return 'report' in plugin && typeof plugin.report === 'function';
  }
}
