import { ConfigurationManager, DEFAULT_CONFIG } from './config-manager';
import { Logger, ConfigurationError } from '../types';
import * as fs from 'fs';

jest.mock('fs');

describe('ConfigurationManager (full coverage)', () => {
  it('should rethrow ConfigurationError in loadConfigFile catch', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockImplementation(() => { throw new ConfigurationError('Test error'); });
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Test error/);
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it('should continue on package.json parse error in findConfigFile', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockImplementation((p) => (typeof p === 'string' && p.endsWith('package.json')));
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('parse error'); });
    const managerInstance = new ConfigurationManager(logger as any);
    const result = await (managerInstance as any).findConfigFile();
    expect(result).toBeNull();
    existsSyncSpy.mockRestore();
    readFileSyncSpy.mockRestore();
  });

  it('should deep merge configs with nested objects and arrays', () => {
    const base = { a: 1, b: { c: 2, d: 3 }, arr: [1,2], obj: { x: 1 } };
    const override = { b: { d: 4, e: 5 }, arr: [3,4], obj: { y: 2 } };
    const merged = (manager as any).mergeConfigs(base, override);
    expect(merged).toEqual({ a: 1, b: { c: 2, d: 4, e: 5 }, arr: [3,4], obj: { x: 1, y: 2 } });
  });
  it('should find config file from possible paths', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockImplementation((p) => (typeof p === 'string' && p.endsWith('config.json')));
    const statSyncSpy = jest.spyOn(fs, 'statSync').mockImplementation(() => ({
      isDirectory: () => true,
      atime: new Date(), mtime: new Date(), ctime: new Date(), birthtime: new Date(),
      atimeMs: 0, mtimeMs: 0, ctimeMs: 0, birthtimeMs: 0,
      dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0,
      isFile: () => false, isBlockDevice: () => false, isCharacterDevice: () => false, isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false
    }));
    const managerInstance = new ConfigurationManager(logger as any);
    const result = await (managerInstance as any).findConfigFile();
    expect(result).toContain('config.json');
    existsSyncSpy.mockRestore();
    statSyncSpy.mockRestore();
  });

  it('should find config in package.json if present', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockImplementation((p) => (typeof p === 'string' && p.endsWith('package.json')));
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockImplementation(() => JSON.stringify({ 'angular-translation-checker': {} }));
    const managerInstance = new ConfigurationManager(logger as any);
    const result = await (managerInstance as any).findConfigFile();
    expect(result).toContain('package.json');
    existsSyncSpy.mockRestore();
    readFileSyncSpy.mockRestore();
  });

  it('should skip package.json if no config present', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockImplementation((p) => (typeof p === 'string' && p.endsWith('package.json')));
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockImplementation(() => JSON.stringify({}));
    const managerInstance = new ConfigurationManager(logger as any);
    const result = await (managerInstance as any).findConfigFile();
    expect(result).toBeNull();
    existsSyncSpy.mockRestore();
    readFileSyncSpy.mockRestore();
  });

  it('should return null if no config file found', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const managerInstance = new ConfigurationManager(logger as any);
    const result = await (managerInstance as any).findConfigFile();
    expect(result).toBeNull();
    existsSyncSpy.mockRestore();
  });

  it('should throw ConfigurationError if config file not found in loadConfigFile', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Configuration file not found/);
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it('should throw ConfigurationError if config file is invalid JSON', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('not-json');
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Failed to load configuration/);
    } finally {
      existsSyncSpy.mockRestore();
      readFileSyncSpy.mockRestore();
    }
  });

  it('should throw ConfigurationError if config file triggers validation error', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ plugins: [{ type: 'extractor' }] }));
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Each plugin must be an object with a name property/);
    } finally {
      existsSyncSpy.mockRestore();
      readFileSyncSpy.mockRestore();
    }
  });

  it('should load config file successfully', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ verbose: true }));
    try {
      const result = await (manager as any).loadConfigFile('good-path');
      expect(result.verbose).toBe(true);
    } finally {
      existsSyncSpy.mockRestore();
      readFileSyncSpy.mockRestore();
    }
  });

  it('should merge configs with undefined/null values', () => {
    const base = { a: 1, b: { c: 2, d: 3 }, arr: [1,2] };
    const override = { b: { d: 4 }, arr: [3], a: 2, x: undefined, y: null };
    const merged = (manager as any).mergeConfigs(base, override);
    expect(merged).toEqual({ a: 2, b: { c: 2, d: 4 }, arr: [3] });
    expect(merged.x).toBeUndefined();
    expect(merged.y).toBeUndefined();
  });
  it('should validate paths and throw for localesPath not a directory', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const statSyncSpy = jest.spyOn(fs, 'statSync').mockImplementation(() => ({
      isDirectory: () => false,
      atime: new Date(), mtime: new Date(), ctime: new Date(), birthtime: new Date(),
      atimeMs: 0, mtimeMs: 0, ctimeMs: 0, birthtimeMs: 0,
      dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0,
      isFile: () => false, isBlockDevice: () => false, isCharacterDevice: () => false, isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false
    }));
    try {
      await expect(manager.validatePaths({ localesPath: '/notdir', srcPath: '/src' })).rejects.toThrow(/Locales path is not a directory/);
    } finally {
      existsSyncSpy.mockRestore();
      statSyncSpy.mockRestore();
    }
  });

  it('should validate paths and throw for srcPath not a directory', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const statSyncSpy = jest.spyOn(fs, 'statSync').mockImplementation((p) => ({
      isDirectory: () => p !== '/src',
      atime: new Date(), mtime: new Date(), ctime: new Date(), birthtime: new Date(),
      atimeMs: 0, mtimeMs: 0, ctimeMs: 0, birthtimeMs: 0,
      dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0,
      isFile: () => false, isBlockDevice: () => false, isCharacterDevice: () => false, isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false
    }));
    try {
      await expect(manager.validatePaths({ localesPath: '/good', srcPath: '/src' })).rejects.toThrow(/Source path is not a directory/);
    } finally {
      existsSyncSpy.mockRestore();
      statSyncSpy.mockRestore();
    }
  });

  it('should validate paths and throw for multiple errors', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    try {
      await expect(manager.validatePaths({ localesPath: '/bad1', srcPath: '/bad2' })).rejects.toThrow(/Configuration validation failed/);
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it('should throw if generateConfigFile fails', async () => {
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error('fail'); });
    try {
      await expect((manager as any).generateConfigFile('bad.json')).rejects.toThrow(/Failed to generate configuration file/);
    } finally {
      writeFileSyncSpy.mockRestore();
    }
  });

  it('should throw for non-object config', () => {
    expect(() => (manager as any).validateConfig(null)).toThrow(/must be an object/);
  });

  it('should throw for invalid localesPath type', () => {
    expect(() => (manager as any).validateConfig({ localesPath: 123 })).toThrow(/localesPath must be a string/);
  });

  it('should throw for invalid srcPath type', () => {
    expect(() => (manager as any).validateConfig({ srcPath: 123 })).toThrow(/srcPath must be a string/);
  });

  it('should throw for invalid array fields', () => {
    expect(() => (manager as any).validateConfig({ ignoreKeys: 'not-array' })).toThrow(/ignoreKeys must be an array/);
  });

  it('should throw for invalid outputFormat', () => {
    expect(() => (manager as any).validateConfig({ outputFormat: 'bad' })).toThrow(/Invalid outputFormat/);
  });

  it('should throw for invalid outputSections', () => {
    expect(() => (manager as any).validateConfig({ outputSections: ['bad'] })).toThrow(/Invalid output section/);
  });

  it('should throw for invalid patterns type', () => {
    expect(() => (manager as any).validateConfig({ patterns: 'not-object' })).toThrow(/patterns must be an object/);
  });

  it('should throw for invalid patterns array', () => {
    expect(() => (manager as any).validateConfig({ patterns: { foo: 'not-array' } })).toThrow(/patterns.foo must be an array/);
  });

  it('should throw for non-string pattern', () => {
    expect(() => (manager as any).validateConfig({ patterns: { foo: [123] } })).toThrow(/must be strings/);
  });

  it('should throw for plugins not array', () => {
    expect(() => (manager as any).validateConfig({ plugins: 'not-array' })).toThrow(/plugins must be an array/);
  });

  it('should throw for plugin missing name', () => {
    expect(() => (manager as any).validateConfig({ plugins: [{}] })).toThrow(/Each plugin must be an object with a name property/);
  });
  let manager: ConfigurationManager;
  let logger: Logger;

  beforeEach(() => {
    logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() } as any;
    manager = new ConfigurationManager(logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should use defaults if no config file is found', async () => {
    jest.spyOn(manager as any, 'findConfigFile').mockResolvedValue(null);
    const config = await manager.loadConfig();
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it('should merge config from file', async () => {
    jest.spyOn(manager as any, 'findConfigFile').mockResolvedValue('dummy-path');
    jest.spyOn(manager as any, 'loadConfigFile').mockResolvedValue({ verbose: true });
    const config = await manager.loadConfig();
    expect(config.verbose).toBe(true);
  });

  it('should throw if config file does not exist', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Configuration file not found/);
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it('should throw if config file is invalid JSON', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('not-json');
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Failed to load configuration/);
    } finally {
      existsSyncSpy.mockRestore();
      readFileSyncSpy.mockRestore();
    }
  });

  it('should throw if config file is missing plugin name', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ plugins: [{ type: 'extractor' }] }));
    try {
      await expect((manager as any).loadConfigFile('bad-path')).rejects.toThrow(/Each plugin must be an object with a name property/);
    } finally {
      existsSyncSpy.mockRestore();
      readFileSyncSpy.mockRestore();
    }
  });

  it('should validate paths and throw for missing localesPath', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    try {
      await expect(manager.validatePaths({ localesPath: '/bad', srcPath: '/src' })).rejects.toThrow(/Locales path does not exist/);
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it('should validate paths and throw for missing srcPath', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockImplementation((p) => p !== '/src');
    const statSyncSpy = jest.spyOn(fs, 'statSync').mockImplementation((p) => {
      if (p === '/good') {
        return {
          isDirectory: () => true,
          // Minimal Stats mock
          atime: new Date(), mtime: new Date(), ctime: new Date(), birthtime: new Date(),
          atimeMs: 0, mtimeMs: 0, ctimeMs: 0, birthtimeMs: 0,
          dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0,
          isFile: () => false, isBlockDevice: () => false, isCharacterDevice: () => false, isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false
        };
      }
      return undefined;
    });
    try {
      await expect(manager.validatePaths({ localesPath: '/good', srcPath: '/src' })).rejects.toThrow(/Source path does not exist/);
    } finally {
      existsSyncSpy.mockRestore();
      statSyncSpy.mockRestore();
    }
  });

  it('should merge configs deeply', () => {
    const merged = (manager as any).mergeConfigs({ a: 1, b: { c: 2 } }, { b: { d: 3 } });
    expect(merged).toEqual({ a: 1, b: { c: 2, d: 3 } });
  });

  it('should generate config file', async () => {
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    try {
      await (manager as any).generateConfigFile('out.json');
      expect(writeFileSyncSpy).toHaveBeenCalledWith('out.json', expect.any(String), 'utf8');
    } finally {
      writeFileSyncSpy.mockRestore();
    }
  });
});
