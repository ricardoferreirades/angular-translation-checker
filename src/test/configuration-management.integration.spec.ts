import { ConfigurationManager, DEFAULT_CONFIG } from '../core/config-manager';

// Mock Logger implementation
class MockLogger {
  debug = jest.fn();
  info = jest.fn();
}

describe('ConfigurationManager', () => {
  it('should find config file from possible paths', async () => {
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockImplementation((p) => (p as string).endsWith('config.json'));
    const statSyncSpy = jest.spyOn(require('fs'), 'statSync').mockImplementation(() => ({ isDirectory: () => true }));
    const managerInstance = new ConfigurationManager(logger as any);
    const result = await (managerInstance as any).findConfigFile();
    expect(result).toContain('config.json');
    existsSyncSpy.mockRestore();
    statSyncSpy.mockRestore();
  });

  it('should find config in package.json if present', async () => {
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockImplementation((p) => (p as string).endsWith('package.json'));
    const readFileSyncSpy = jest.spyOn(require('fs'), 'readFileSync').mockImplementation(() => JSON.stringify({ 'angular-translation-checker': {} }));
    const managerInstance = new ConfigurationManager(logger as any);
    const result = await (managerInstance as any).findConfigFile();
    expect(result).toContain('package.json');
    existsSyncSpy.mockRestore();
    readFileSyncSpy.mockRestore();
  });

  it('should skip package.json if no config present', async () => {
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockImplementation((p) => (p as string).endsWith('package.json'));
    const readFileSyncSpy = jest.spyOn(require('fs'), 'readFileSync').mockImplementation(() => JSON.stringify({}));
    const managerInstance = new ConfigurationManager(logger as any);
    const result = await (managerInstance as any).findConfigFile();
    expect(result).toBeNull();
    existsSyncSpy.mockRestore();
    readFileSyncSpy.mockRestore();
  });

  it('should return null if no config file found', async () => {
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
    const managerInstance = new ConfigurationManager(logger as any);
    const result = await (managerInstance as any).findConfigFile();
    expect(result).toBeNull();
    existsSyncSpy.mockRestore();
  });

  it('should throw ConfigurationError if config file not found in loadConfigFile', async () => {
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Configuration file not found/);
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it('should throw ConfigurationError if config file is invalid JSON', async () => {
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
    const readFileSyncSpy = jest.spyOn(require('fs'), 'readFileSync').mockReturnValue('not-json');
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Failed to load configuration/);
    } finally {
      existsSyncSpy.mockRestore();
      readFileSyncSpy.mockRestore();
    }
  });

  it('should throw ConfigurationError if config file triggers validation error', async () => {
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
    const readFileSyncSpy = jest.spyOn(require('fs'), 'readFileSync').mockReturnValue(JSON.stringify({ plugins: [{ type: 'extractor' }] }));
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Each plugin must be an object with a name property/);
    } finally {
      existsSyncSpy.mockRestore();
      readFileSyncSpy.mockRestore();
    }
  });

  it('should load config file successfully', async () => {
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
    const readFileSyncSpy = jest.spyOn(require('fs'), 'readFileSync').mockReturnValue(JSON.stringify({ verbose: true }));
    try {
      const result = await (manager as any).loadConfigFile('good-path');
      expect(result.verbose).toBe(true);
    } finally {
      existsSyncSpy.mockRestore();
      readFileSyncSpy.mockRestore();
    }
  });
  let manager: ConfigurationManager;
  let logger: MockLogger;

  beforeEach(() => {
    logger = new MockLogger();
    manager = new ConfigurationManager(logger as any);
  });

  it('should return default config if no config file is found', async () => {
    // Simulate no config file found
    jest.spyOn(manager as any, 'findConfigFile').mockResolvedValue(null);
    const config = await manager.loadConfig();
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it('should merge config from file with defaults', async () => {
    // Simulate config file found and loaded
    const fileConfig = { verbose: true, outputFormat: 'json' };
    jest.spyOn(manager as any, 'findConfigFile').mockResolvedValue('dummy-path');
    jest.spyOn(manager as any, 'loadConfigFile').mockResolvedValue(fileConfig);

    const config = await manager.loadConfig();
    expect(config.verbose).toBe(true);
    expect(config.outputFormat).toBe('json');
    expect(config.localesPath).toBe(DEFAULT_CONFIG.localesPath);
  });

  it('should throw ConfigurationError for missing config file', async () => {
    jest.spyOn(manager as any, 'findConfigFile').mockResolvedValue('missing-path');
    jest.spyOn(manager as any, 'loadConfigFile').mockImplementation(() => { throw new Error('File not found'); });
    await expect(manager.loadConfig()).rejects.toThrow('File not found');
  });

  it('should throw ConfigurationError for invalid plugin config (missing name)', async () => {
    const badConfig = { plugins: [{ type: 'extractor' }] };
    expect(() => (manager as any).validateConfig(badConfig)).toThrow('Each plugin must be an object with a name property');
  });

  it('should throw ConfigurationError for invalid localesPath', async () => {
    const badConfig = { localesPath: '/invalid/path', srcPath: './src' };
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
    try {
      await expect(manager.validatePaths(badConfig)).rejects.toThrow(/Locales path does not exist/);
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it('should throw ConfigurationError for invalid srcPath', async () => {
    const badConfig = { localesPath: './locales', srcPath: '/invalid/src' };
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockImplementation((p) => p !== '/invalid/src');
    const statSyncSpy = jest.spyOn(require('fs'), 'statSync').mockImplementation(() => ({ isDirectory: () => true }));
    try {
      await expect(manager.validatePaths(badConfig)).rejects.toThrow(/Source path does not exist/);
    } finally {
      existsSyncSpy.mockRestore();
      statSyncSpy.mockRestore();
    }
  });

  it('should throw ConfigurationError for localesPath not a directory', async () => {
    const badConfig = { localesPath: '/not/dir', srcPath: './src' };
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
    const statSyncSpy = jest.spyOn(require('fs'), 'statSync').mockImplementation(() => ({ isDirectory: () => false }));
    try {
      await expect(manager.validatePaths(badConfig)).rejects.toThrow(/Locales path is not a directory/);
    } finally {
      existsSyncSpy.mockRestore();
      statSyncSpy.mockRestore();
    }
  });

  it('should throw ConfigurationError for srcPath not a directory', async () => {
    const badConfig = { localesPath: './locales', srcPath: '/not/dir' };
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
    const statSyncSpy = jest.spyOn(require('fs'), 'statSync').mockImplementation((p) => ({ isDirectory: () => p !== '/not/dir' }));
    try {
      await expect(manager.validatePaths(badConfig)).rejects.toThrow(/Source path is not a directory/);
    } finally {
      existsSyncSpy.mockRestore();
      statSyncSpy.mockRestore();
    }
  });

  it('should throw ConfigurationError for multiple path errors', async () => {
    const badConfig = { localesPath: '/bad1', srcPath: '/bad2' };
    const existsSyncSpy = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
    try {
      await expect(manager.validatePaths(badConfig)).rejects.toThrow(/Configuration validation failed/);
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it('should generate config file successfully', async () => {
    const writeFileSyncSpy = jest.spyOn(require('fs'), 'writeFileSync').mockImplementation(() => {});
    const infoSpy = jest.spyOn(manager['logger'], 'info').mockImplementation(() => {});
    await manager.generateConfigFile('test-config.json');
    expect(writeFileSyncSpy).toHaveBeenCalledWith('test-config.json', expect.any(String), 'utf8');
    expect(infoSpy).toHaveBeenCalled();
    writeFileSyncSpy.mockRestore();
    infoSpy.mockRestore();
  });

  it('should throw ConfigurationError if generateConfigFile fails', async () => {
    const writeFileSyncSpy = jest.spyOn(require('fs'), 'writeFileSync').mockImplementation(() => { throw new Error('fail'); });
    await expect(manager.generateConfigFile('bad.json')).rejects.toThrow(/Failed to generate configuration file/);
    writeFileSyncSpy.mockRestore();
  });

  it('should deep merge configs', () => {
    const base = { a: 1, b: { c: 2, d: 3 }, arr: [1,2] };
    const override = { b: { d: 4 }, arr: [3], a: 2 };
    const merged = (manager as any).mergeConfigs(base, override);
    expect(merged).toEqual({ a: 2, b: { c: 2, d: 4 }, arr: [3] });
  });

  it('should validateConfig throw for non-object', () => {
    expect(() => (manager as any).validateConfig(null)).toThrow(/must be an object/);
  });
  it('should validateConfig throw for invalid localesPath type', () => {
    expect(() => (manager as any).validateConfig({ localesPath: 123 })).toThrow(/localesPath must be a string/);
  });
  it('should validateConfig throw for invalid srcPath type', () => {
    expect(() => (manager as any).validateConfig({ srcPath: 123 })).toThrow(/srcPath must be a string/);
  });
  it('should validateConfig throw for invalid array fields', () => {
    expect(() => (manager as any).validateConfig({ ignoreKeys: 'not-array' })).toThrow(/ignoreKeys must be an array/);
  });
  it('should validateConfig throw for invalid outputFormat', () => {
    expect(() => (manager as any).validateConfig({ outputFormat: 'bad' })).toThrow(/Invalid outputFormat/);
  });
  it('should validateConfig throw for invalid outputSections', () => {
    expect(() => (manager as any).validateConfig({ outputSections: ['bad'] })).toThrow(/Invalid output section/);
  });
  it('should validateConfig throw for invalid patterns type', () => {
    expect(() => (manager as any).validateConfig({ patterns: 'not-object' })).toThrow(/patterns must be an object/);
  });
  it('should validateConfig throw for invalid patterns array', () => {
    expect(() => (manager as any).validateConfig({ patterns: { foo: 'not-array' } })).toThrow(/patterns.foo must be an array/);
  });
  it('should validateConfig throw for non-string pattern', () => {
    expect(() => (manager as any).validateConfig({ patterns: { foo: [123] } })).toThrow(/must be strings/);
  });
  it('should validateConfig throw for plugins not array', () => {
    expect(() => (manager as any).validateConfig({ plugins: 'not-array' })).toThrow(/plugins must be an array/);
  });
  it('should validateConfig throw for plugin missing name', () => {
    expect(() => (manager as any).validateConfig({ plugins: [{}] })).toThrow(/Each plugin must be an object with a name property/);
  });
});

// Integration test for Configuration Management feature

describe('Configuration Management Integration', () => {
  it('should load and merge configuration correctly', () => {
    // TODO: Implement integration test
  });
});
