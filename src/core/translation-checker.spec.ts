import { Logger, EventBus, FileSystemAdapter, AnalysisConfig as BaseAnalysisConfig, TranslationKey } from '../types';

// Extend AnalysisConfig for test purposes to include 'foo' and 'newProp'
type AnalysisConfig = BaseAnalysisConfig & { foo?: string; newProp?: number };
import { ConfigurationManager } from './config-manager';
import { ConsoleLogger } from './logger';
import { PluginManager } from './plugin-manager';
import { TranslationChecker } from './translation-checker';
import { TranslationFile, AnalysisResult } from '../types';
import { NodeFileSystemAdapter } from './filesystem';

describe('TranslationChecker', () => {
  let logger: ConsoleLogger;
  let eventBus: jest.Mocked<EventBus>;
  let pluginManager: jest.Mocked<PluginManager>;
  let configManager: jest.Mocked<ConfigurationManager>;
  let fileSystem: jest.Mocked<NodeFileSystemAdapter>;
  let checker: TranslationChecker;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      setVerbose: jest.fn()
    } as unknown as jest.Mocked<ConsoleLogger>;
    Object.setPrototypeOf(logger, ConsoleLogger.prototype);
    eventBus = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    } as jest.Mocked<EventBus>;
    pluginManager = {} as jest.Mocked<PluginManager>;
    configManager = {
      loadConfig: jest.fn().mockResolvedValue({ verbose: true } as any), // <-- ensure verbose: true
      generateConfigFile: jest.fn(),
      validatePaths: jest.fn()
    } as unknown as jest.Mocked<ConfigurationManager>;
    fileSystem = {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      exists: jest.fn(),
      readdir: jest.fn(),
      stat: jest.fn(),
      mkdir: jest.fn(),
      unlink: jest.fn(),
      rmdir: jest.fn(),
      glob: jest.fn()
    } as unknown as jest.Mocked<NodeFileSystemAdapter>;
    checker = new TranslationChecker(logger, eventBus, pluginManager, configManager, fileSystem);
  });

  it('should initialize and emit events', async () => {
    const config = await checker.initialize('some/path', { custom: true } as Partial<AnalysisConfig>);
    expect(eventBus.emit).toHaveBeenCalledWith('checker:initializing', { configPath: 'some/path' });
    expect(configManager.loadConfig).toHaveBeenCalledWith('some/path');
    expect(logger.setVerbose).toHaveBeenCalledWith(true);
    expect(eventBus.emit).toHaveBeenCalledWith('checker:initialized', { config });
    // Update this line to match the actual implementation:
    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('initialized'));
    });

    it('should apply configOverrides during initialization', async () => {
        // Arrange: configManager.loadConfig returns { verbose: false, foo: 'bar' }
        (configManager.loadConfig as jest.Mock).mockResolvedValue({ verbose: false, foo: 'bar' } as any);
        const overrides = { verbose: true, foo: 'baz', newProp: 123 } as Partial<AnalysisConfig>;

        // Act
        const config = await checker.initialize('config/path', overrides);

        // Assert: overrides should be applied to config
        expect(config.verbose).toBe(true);
        expect((config as AnalysisConfig).foo).toBe('baz');
        expect((config as any).newProp).toBe(123);
        expect(configManager.loadConfig).toHaveBeenCalledWith('config/path');
        expect(logger.setVerbose).toHaveBeenCalledWith(true);
        expect(eventBus.emit).toHaveBeenCalledWith('checker:initializing', { configPath: 'config/path' });
        expect(eventBus.emit).toHaveBeenCalledWith('checker:initialized', { config });
        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('initialized'));
    });

    it('should throw and emit error event if initialization fails', async () => {
        // Arrange: configManager.loadConfig throws error
        const error = new Error('Config load failed');
        (configManager.loadConfig as jest.Mock).mockRejectedValue(error);

        // Act & Assert
        await expect(checker.initialize('bad/path')).rejects.toThrow('Initialization failed');
        expect(eventBus.emit).toHaveBeenCalledWith(
            'checker:error',
            expect.objectContaining({ error: expect.any(Error) })
        );
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Initialization failed'));
    });

    it('should call validatePaths and register plugins during initialization', async () => {
        // Spy on private methods
        const registerBuiltInPluginsSpy = jest.spyOn<any, any>(checker as any, 'registerBuiltInPlugins').mockImplementation(jest.fn());
        const registerCustomPluginsSpy = jest.spyOn<any, any>(checker as any, 'registerCustomPlugins').mockImplementation(jest.fn());

        await checker.initialize('some/path');
        expect(configManager.validatePaths).toHaveBeenCalled();
        expect(registerBuiltInPluginsSpy).toHaveBeenCalled();
        expect(registerCustomPluginsSpy).toHaveBeenCalled();

        // Restore spies
        registerBuiltInPluginsSpy.mockRestore();
        registerCustomPluginsSpy.mockRestore();
    });

    describe('analyze', () => {
        let config: AnalysisConfig;
        let translationFiles: TranslationFile[];
        let sourceFiles: string[];
        let extractedKeys: TranslationKey[];
        let analysisResult: AnalysisResult;

        beforeEach(() => {
            config = {
                localesPath: '/locales',
                srcPath: '/src',
                patterns: { typescript: ['**/*.ts'] },
                verbose: false
            };

            translationFiles = [
                { language: 'en', path: '/locales/en.json', keys: { HELLO: 'Hello' } },
                { language: 'fr', path: '/locales/fr.json', keys: { HELLO: 'Bonjour' } }
            ];
            sourceFiles = ['/src/app.component.ts'];
            extractedKeys = [{ key: 'HELLO', file: '/src/app.component.ts', line: 1 }];
            analysisResult = {
                summary: {
                    totalTranslations: 1,
                    totalUsedKeys: 1,
                    totalUnusedKeys: 0,
                    totalMissingKeys: 0,
                    coverage: 100,
                    languages: ['en', 'fr']
                },
                usedKeys: extractedKeys,
                unusedKeys: [],
                missingKeys: [],
                dynamicPatterns: [],
                ignoredKeys: [],
                translationFiles,
                config
            };

            // Mock fileSystem methods to prevent errors during source file discovery
            fileSystem.readFile.mockResolvedValue('{}');
            fileSystem.exists.mockResolvedValue(true);
            fileSystem.readdir.mockResolvedValue(['app.component.ts']);
        });

        it('should orchestrate analysis and emit events', async () => {
            // Spy on private methods
            const discoverTranslationFilesSpy = jest.spyOn<any, any>(checker as any, 'discoverTranslationFiles').mockResolvedValue(translationFiles);
            const discoverSourceFilesSpy = jest.spyOn<any, any>(checker as any, 'discoverSourceFiles').mockResolvedValue(sourceFiles);
            const extractTranslationKeysSpy = jest.spyOn<any, any>(checker as any, 'extractTranslationKeys').mockResolvedValue(extractedKeys);
            const runAnalyzersSpy = jest.spyOn<any, any>(checker as any, 'runAnalyzers').mockResolvedValue(analysisResult);
            const runValidatorsSpy = jest.spyOn<any, any>(checker as any, 'runValidators').mockResolvedValue(undefined);

            const result = await checker.analyze(config);

            expect(eventBus.emit).toHaveBeenCalledWith('analysis:started', { config });
            expect(discoverTranslationFilesSpy).toHaveBeenCalledWith(config);
            expect(discoverSourceFilesSpy).toHaveBeenCalledWith(config);
            expect(extractTranslationKeysSpy).toHaveBeenCalledWith(sourceFiles, config);
            expect(runAnalyzersSpy).toHaveBeenCalledWith({
            config,
            sourceFiles,
            translationFiles,
            extractedKeys
            });
            expect(runValidatorsSpy).toHaveBeenCalledWith(analysisResult);
            expect(eventBus.emit).toHaveBeenCalledWith('analysis:completed', { result: analysisResult });
            expect(logger.info).toHaveBeenCalledWith('Translation analysis completed');
            expect(result).toBe(analysisResult);

            // Restore spies
            discoverTranslationFilesSpy.mockRestore();
            discoverSourceFilesSpy.mockRestore();
            extractTranslationKeysSpy.mockRestore();
            runAnalyzersSpy.mockRestore();
            runValidatorsSpy.mockRestore();
        });

        it('should throw and emit error event if analysis fails', async () => {
            const error = new Error('Analysis failed');
            // Mock the first private method used in analyze to throw
            const discoverTranslationFilesSpy = jest.spyOn<any, any>(checker as any, 'discoverTranslationFiles').mockRejectedValue(error);

            await expect(checker.analyze(config)).rejects.toThrow('Analysis failed');
            expect(eventBus.emit).toHaveBeenCalledWith(
                'analysis:error',
                expect.objectContaining({ error: expect.any(Error) })
            );
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Analysis failed'));

            // Restore spy
            discoverTranslationFilesSpy.mockRestore();
        });

        it('should call logger.info at start and end', async () => {
            // Mock private methods to avoid side effects and errors
            const discoverTranslationFilesSpy = jest.spyOn<any, any>(checker as any, 'discoverTranslationFiles').mockResolvedValue(translationFiles);
            const discoverSourceFilesSpy = jest.spyOn<any, any>(checker as any, 'discoverSourceFiles').mockResolvedValue(sourceFiles);
            const extractTranslationKeysSpy = jest.spyOn<any, any>(checker as any, 'extractTranslationKeys').mockResolvedValue(extractedKeys);
            const runAnalyzersSpy = jest.spyOn<any, any>(checker as any, 'runAnalyzers').mockResolvedValue(analysisResult);
            const runValidatorsSpy = jest.spyOn<any, any>(checker as any, 'runValidators').mockResolvedValue(undefined);

            await checker.analyze(config);
            expect(logger.info).toHaveBeenCalledWith('Starting translation analysis...');
            expect(logger.info).toHaveBeenCalledWith('Translation analysis completed');

            // Restore spies
            discoverTranslationFilesSpy.mockRestore();
            discoverSourceFilesSpy.mockRestore();
            extractTranslationKeysSpy.mockRestore();
            runAnalyzersSpy.mockRestore();
            runValidatorsSpy.mockRestore();
        });

        it('should call logger.debug with file counts', async () => {
            // Mock private methods to avoid side effects and errors
            const discoverTranslationFilesSpy = jest.spyOn<any, any>(checker as any, 'discoverTranslationFiles').mockResolvedValue(translationFiles);
            const discoverSourceFilesSpy = jest.spyOn<any, any>(checker as any, 'discoverSourceFiles').mockResolvedValue(sourceFiles);
            const extractTranslationKeysSpy = jest.spyOn<any, any>(checker as any, 'extractTranslationKeys').mockResolvedValue(extractedKeys);
            const runAnalyzersSpy = jest.spyOn<any, any>(checker as any, 'runAnalyzers').mockResolvedValue(analysisResult);
            const runValidatorsSpy = jest.spyOn<any, any>(checker as any, 'runValidators').mockResolvedValue(undefined);

            await checker.analyze(config);
            expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Found 2 translation files'));
            expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Found 1 source files'));
            expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Extracted 1 translation keys'));

            // Restore spies
            discoverTranslationFilesSpy.mockRestore();
            discoverSourceFilesSpy.mockRestore();
            extractTranslationKeysSpy.mockRestore();
            runAnalyzersSpy.mockRestore();
            runValidatorsSpy.mockRestore();
        });
    });
});
