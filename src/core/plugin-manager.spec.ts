import { PluginManager } from './plugin-manager';
import { PluginError } from '../types';

describe('PluginManager', () => {
  let manager: PluginManager;
  let logger: any;
  let eventBus: any;

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn()
    };
    eventBus = {
      emit: jest.fn()
    };
    manager = new PluginManager(logger, eventBus);
  });

  it('should register a valid plugin', async () => {
    const plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      initialize: jest.fn().mockResolvedValue(undefined)
    };
    const config = { localesPath: 'locales', srcPath: 'src' };
    await manager.registerPlugin(plugin as any, config);
    expect(manager.getPlugin('test-plugin')).toBe(plugin);
    expect(logger.info).toHaveBeenCalledWith('Successfully registered plugin: test-plugin');
    expect(eventBus.emit).toHaveBeenCalledWith('plugin:registered', { plugin: 'test-plugin' });
  });

  it('should throw if plugin name is missing', async () => {
    const plugin = { version: '1.0.0', initialize: jest.fn() };
    await expect(manager.registerPlugin(plugin as any, { localesPath: 'locales', srcPath: 'src' })).rejects.toThrow(PluginError);
    expect(logger.error).toHaveBeenCalled();
  });

  it('should throw if plugin name is duplicate', async () => {
    const plugin = {
      name: 'dup-plugin',
      version: '1.0.0',
      initialize: jest.fn().mockResolvedValue(undefined)
    };
    await manager.registerPlugin(plugin as any, { localesPath: 'locales', srcPath: 'src' });
    await expect(manager.registerPlugin(plugin as any, { localesPath: 'locales', srcPath: 'src' })).rejects.toThrow(/already registered/);
    expect(logger.error).toHaveBeenCalled();
  });

  it('should unregister a plugin', async () => {
    const plugin = {
      name: 'to-remove',
      version: '1.0.0',
      initialize: jest.fn().mockResolvedValue(undefined),
      cleanup: jest.fn().mockResolvedValue(undefined)
    };
    await manager.registerPlugin(plugin as any, { localesPath: 'locales', srcPath: 'src' });
    await manager.unregisterPlugin('to-remove');
    expect(manager.getPlugin('to-remove')).toBeUndefined();
    expect(logger.info).toHaveBeenCalledWith('Successfully unregistered plugin: to-remove');
    expect(eventBus.emit).toHaveBeenCalledWith('plugin:unregistered', { plugin: 'to-remove' });
    expect(plugin.cleanup).toHaveBeenCalled();
  });

  it('should throw if unregistering unknown plugin', async () => {
    await expect(manager.unregisterPlugin('unknown')).rejects.toThrow(PluginError);
    expect(logger.error).toHaveBeenCalled();
  });

  it('should get all plugins', async () => {
    const pluginA = { name: 'A', version: '1', initialize: jest.fn() };
    const pluginB = { name: 'B', version: '1', initialize: jest.fn() };
    await manager.registerPlugin(pluginA as any, { localesPath: 'locales', srcPath: 'src' });
    await manager.registerPlugin(pluginB as any, { localesPath: 'locales', srcPath: 'src' });
    expect(manager.getAllPlugins()).toEqual([pluginA, pluginB]);
    expect(manager.getPluginCount()).toBe(2);
  });

  it('should cleanup all plugins', async () => {
    const pluginA = { name: 'A', version: '1', initialize: jest.fn(), cleanup: jest.fn().mockResolvedValue(undefined) };
    const pluginB = { name: 'B', version: '1', initialize: jest.fn(), cleanup: jest.fn().mockResolvedValue(undefined) };
    await manager.registerPlugin(pluginA as any, { localesPath: 'locales', srcPath: 'src' });
    await manager.registerPlugin(pluginB as any, { localesPath: 'locales', srcPath: 'src' });
    await manager.cleanup();
    expect(manager.getPluginCount()).toBe(0);
    expect(pluginA.cleanup).toHaveBeenCalled();
    expect(pluginB.cleanup).toHaveBeenCalled();
  });
});
