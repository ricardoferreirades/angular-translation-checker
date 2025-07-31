import { TranslationChecker } from './translation-checker';

describe('TranslationChecker', () => {
  it('should be defined and instantiable', () => {
    const checker = new TranslationChecker();
    expect(checker).toBeInstanceOf(TranslationChecker);
  });

  it('should call initialize and handle config, plugins, and events', async () => {
    const checker = new TranslationChecker();
    // Mock dependencies
    checker['configManager'] = {
      loadConfig: jest.fn().mockResolvedValue({ verbose: true }),
      validatePaths: jest.fn().mockResolvedValue(undefined)
    } as any;
    checker['registerBuiltInPlugins'] = jest.fn().mockResolvedValue(undefined);
    checker['registerCustomPlugins'] = jest.fn().mockResolvedValue(undefined);
    checker['eventBus'] = { emit: jest.fn() } as any;
    checker['logger'] = { setVerbose: jest.fn(), debug: jest.fn(), error: jest.fn() } as any;
    const config = await checker.initialize('path', { custom: true } as any);
    expect(checker['configManager'].loadConfig).toHaveBeenCalledWith('path');
    expect(checker['configManager'].validatePaths).toHaveBeenCalled();
    expect(checker['registerBuiltInPlugins']).toHaveBeenCalled();
    expect(checker['registerCustomPlugins']).toHaveBeenCalled();
    expect(checker['eventBus'].emit).toHaveBeenCalledWith('checker:initialized', expect.anything());
    expect(config.verbose).toBe(true);
  });

  it('should handle initialize error', async () => {
    const checker = new TranslationChecker();
    checker['configManager'] = {
      loadConfig: jest.fn().mockRejectedValue(new Error('fail')),
      validatePaths: jest.fn()
    } as any;
    checker['eventBus'] = { emit: jest.fn() } as any;
    checker['logger'] = { setVerbose: jest.fn(), debug: jest.fn(), error: jest.fn() } as any;
    await expect(checker.initialize('bad')).rejects.toThrow('Initialization failed');
    expect(checker['logger'].error).toHaveBeenCalled();
    expect(checker['eventBus'].emit).toHaveBeenCalledWith('checker:error', expect.anything());
  });

  it('should call analyze and run all steps', async () => {
    const checker = new TranslationChecker();
    checker['eventBus'] = { emit: jest.fn() } as any;
    checker['logger'] = { info: jest.fn(), debug: jest.fn(), error: jest.fn() } as any;
    checker['discoverTranslationFiles'] = jest.fn().mockResolvedValue([{ language: 'en', path: 'p', keys: {} }]);
    checker['discoverSourceFiles'] = jest.fn().mockResolvedValue(['src/a.ts']);
    checker['extractTranslationKeys'] = jest.fn().mockResolvedValue(['key']);
    checker['runAnalyzers'] = jest.fn().mockResolvedValue({ summary: {}, usedKeys: [], unusedKeys: [], missingKeys: [], dynamicPatterns: [], ignoredKeys: [], translationFiles: [], config: {} });
    checker['runValidators'] = jest.fn().mockResolvedValue(undefined);
    const result = await checker.analyze({} as any);
    expect(checker['discoverTranslationFiles']).toHaveBeenCalled();
    expect(checker['discoverSourceFiles']).toHaveBeenCalled();
    expect(checker['extractTranslationKeys']).toHaveBeenCalled();
    expect(checker['runAnalyzers']).toHaveBeenCalled();
    expect(checker['runValidators']).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should handle analyze error', async () => {
    const checker = new TranslationChecker();
    checker['eventBus'] = { emit: jest.fn() } as any;
    checker['logger'] = { info: jest.fn(), debug: jest.fn(), error: jest.fn() } as any;
    checker['discoverTranslationFiles'] = jest.fn().mockRejectedValue(new Error('fail'));
    await expect(checker.analyze({} as any)).rejects.toThrow('Analysis failed');
    expect(checker['logger'].error).toHaveBeenCalled();
    expect(checker['eventBus'].emit).toHaveBeenCalledWith('analysis:error', expect.anything());
  });

  it('should call format with formatter', async () => {
    const checker = new TranslationChecker();
    checker['pluginManager'] = { getFormatter: jest.fn().mockReturnValue({ name: 'f', format: jest.fn().mockResolvedValue('out') }) } as any;
    checker['logger'] = { debug: jest.fn(), error: jest.fn() } as any;
    const result = await checker.format({} as any, 'json', []);
    expect(result).toBe('out');
    expect(checker['pluginManager'].getFormatter).toHaveBeenCalledWith('json');
  });

  it('should handle format error if no formatter', async () => {
    const checker = new TranslationChecker();
    checker['pluginManager'] = { getFormatter: jest.fn().mockReturnValue(undefined) } as any;
    checker['logger'] = { debug: jest.fn(), error: jest.fn() } as any;
    await expect(checker.format({} as any, 'bad', [])).rejects.toThrow('No formatter found');
    expect(checker['logger'].error).toHaveBeenCalled();
  });

  it('should call report for all reporters', async () => {
    const checker = new TranslationChecker();
    const reporter = { report: jest.fn().mockResolvedValue(undefined), name: 'r' };
    checker['pluginManager'] = { getReporters: jest.fn().mockReturnValue([reporter]) } as any;
    checker['logger'] = { error: jest.fn() } as any;
    await checker.report({} as any, 'out');
    expect(reporter.report).toHaveBeenCalledWith({}, 'out');
  });

  it('should handle report error', async () => {
    const checker = new TranslationChecker();
    const reporter = { report: jest.fn().mockRejectedValue(new Error('fail')), name: 'r' };
    checker['pluginManager'] = { getReporters: jest.fn().mockReturnValue([reporter]) } as any;
    checker['logger'] = { error: jest.fn() } as any;
    await checker.report({} as any, 'out');
    expect(checker['logger'].error).toHaveBeenCalledWith(expect.stringContaining('Reporter r failed'));
  });

  it('should call cleanup and emit event', async () => {
    const checker = new TranslationChecker();
    checker['pluginManager'] = { cleanup: jest.fn().mockResolvedValue(undefined) } as any;
    checker['eventBus'] = { emit: jest.fn() } as any;
    await checker.cleanup();
    expect(checker['pluginManager'].cleanup).toHaveBeenCalled();
    expect(checker['eventBus'].emit).toHaveBeenCalledWith('checker:cleanup', {});
  });
});
import { ConsoleLogger, SilentLogger } from './logger';

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  beforeEach(() => {
    logger = new ConsoleLogger(true);
  });

  it('should not throw for all log methods', () => {
    expect(() => logger.info('info')).not.toThrow();
    expect(() => logger.warn('warn')).not.toThrow();
    expect(() => logger.error('error')).not.toThrow();
    expect(() => logger.debug('debug')).not.toThrow();
    expect(() => logger.verbose('verbose')).not.toThrow();
  });

  it('should toggle verbosity', () => {
    logger.setVerbose(false);
    expect(() => logger.debug('debug')).not.toThrow();
    expect(() => logger.verbose('verbose')).not.toThrow();
  });

  it('should write to stdout for info and debug (when verbose)', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('info message');
    logger.debug('debug message');
    logger.verbose('verbose message');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('info message'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('debug message'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('verbose message'));
    spy.mockRestore();
  });

  it('should write to stderr for warn and error', () => {
    const spy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    logger.warn('warn message');
    logger.error('error message');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('warn message'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('error message'));
    spy.mockRestore();
  });

  it('should not write debug/verbose when not verbose', () => {
    logger.setVerbose(false);
    const spyOut = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.debug('should not print');
    logger.verbose('should not print');
    // Only info should print
    logger.info('should print');
    expect(spyOut).toHaveBeenCalledWith(expect.stringContaining('should print'));
    // debug/verbose should not print
    expect(spyOut).not.toHaveBeenCalledWith(expect.stringContaining('should not print'));
    spyOut.mockRestore();
  });
});

describe('SilentLogger', () => {
  let logger: SilentLogger;
  beforeEach(() => {
    logger = new SilentLogger();
  });

  it('should not throw for all log methods', () => {
    expect(() => logger.info()).not.toThrow();
    expect(() => logger.warn()).not.toThrow();
    expect(() => logger.error()).not.toThrow();
    expect(() => logger.debug()).not.toThrow();
    expect(() => logger.verbose()).not.toThrow();
  });
});
