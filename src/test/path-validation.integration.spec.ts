// Integration test for Path Validation feature

import { ConfigurationManager } from '../core/config-manager';
import { ConfigurationError } from '../types/index';

describe('Path Validation Integration', () => {
  let manager: ConfigurationManager;
  let config: any;
  let existsSyncSpy: jest.SpyInstance;
  let statSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    manager = new ConfigurationManager({ debug: jest.fn(), info: jest.fn() } as any);
    config = {
      localesPath: '/valid/locales',
      srcPath: '/valid/src'
    };
    existsSyncSpy = jest.spyOn(require('fs'), 'existsSync');
    statSyncSpy = jest.spyOn(require('fs'), 'statSync');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should pass when both paths exist and are directories', async () => {
    existsSyncSpy.mockImplementation(() => true);
    statSyncSpy.mockImplementation(() => ({ isDirectory: () => true }));
    await expect(manager.validatePaths(config)).resolves.not.toThrow();
  });

  it('should throw if localesPath does not exist', async () => {
    existsSyncSpy.mockImplementation((p) => p === config.srcPath);
    statSyncSpy.mockImplementation(() => ({ isDirectory: () => true }));
    await expect(manager.validatePaths(config)).rejects.toThrow(ConfigurationError);
  });

  it('should throw if srcPath does not exist', async () => {
    existsSyncSpy.mockImplementation((p) => p === config.localesPath);
    statSyncSpy.mockImplementation(() => ({ isDirectory: () => true }));
    await expect(manager.validatePaths(config)).rejects.toThrow(ConfigurationError);
  });

  it('should throw if localesPath is not a directory', async () => {
    existsSyncSpy.mockImplementation(() => true);
    statSyncSpy.mockImplementation((p) => ({ isDirectory: () => p !== config.localesPath }));
    await expect(manager.validatePaths(config)).rejects.toThrow(ConfigurationError);
  });

  it('should throw if srcPath is not a directory', async () => {
    existsSyncSpy.mockImplementation(() => true);
    statSyncSpy.mockImplementation((p) => ({ isDirectory: () => p !== config.srcPath }));
    await expect(manager.validatePaths(config)).rejects.toThrow(ConfigurationError);
  });
});
