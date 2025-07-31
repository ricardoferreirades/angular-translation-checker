// Integration test for Plugin Support feature

import { PluginManager } from '../core/plugin-manager';
import { PluginError } from '../types/index';

const mockLogger = { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn(), verbose: jest.fn() };
const mockEventBus = { emit: jest.fn(), on: jest.fn(), off: jest.fn() };

describe('Plugin Support Integration', () => {
  it('should register and retrieve a plugin', async () => {
    const manager = new PluginManager(mockLogger as any, mockEventBus as any);
    const plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      description: 'Test plugin',
      async initialize() {}
    };
    await manager.registerPlugin(plugin as any, { localesPath: './i18n', srcPath: './src' });
    expect(manager.getPlugin('test-plugin')).toBe(plugin);
    expect(manager.getPluginCount()).toBe(1);
  });

  it('should throw error for duplicate plugin name', async () => {
    const manager = new PluginManager(mockLogger as any, mockEventBus as any);
    const plugin = {
      name: 'duplicate-plugin',
      version: '1.0.0',
      description: 'Test plugin',
      async initialize() {}
    };
    await manager.registerPlugin(plugin as any, { localesPath: './i18n', srcPath: './src' });
    await expect(manager.registerPlugin(plugin as any, { localesPath: './i18n', srcPath: './src' })).rejects.toThrow(PluginError);
  });

  it('should throw error for plugin config missing name', async () => {
    const manager = new PluginManager(mockLogger as any, mockEventBus as any);
    const badPlugin = {
      version: '1.0.0',
      description: 'Bad plugin',
      async initialize() {}
    };
    await expect(manager.registerPlugin(badPlugin as any, { localesPath: './i18n', srcPath: './src' })).rejects.toThrow();
  });
});
