

import { NodeFileSystemAdapter, NodeFs, NodePath } from './filesystem';

describe('NodeFileSystemAdapter (DI)', () => {
  let adapter: NodeFileSystemAdapter;
  let mockFs: NodeFs;
  let mockPath: NodePath;

  beforeEach(() => {
    const readFileMock = jest.fn((path, options, cb) => cb(null, 'mocked data'));
    (readFileMock as any).__promisify__ = true;
    const writeFileMock = jest.fn();
    (writeFileMock as any).__promisify__ = true;
    const readdirMock = jest.fn();
    (readdirMock as any).__promisify__ = true;
    const statMock = jest.fn();
    (statMock as any).__promisify__ = true;
    mockFs = {
      readFile: readFileMock,
      writeFile: writeFileMock,
      readdir: readdirMock,
      stat: statMock,
      mkdirSync: jest.fn(),
      promises: {
        readFile: jest.fn().mockResolvedValue('mocked data')
      }
    } as any;
    mockPath = {
      dirname: jest.fn(),
      join: jest.fn(),
      relative: jest.fn()
    };
    adapter = new NodeFileSystemAdapter(mockFs as any, mockPath);
  });

  it('should readFile successfully using the injected mock', async () => {
    const result = await adapter.readFile('file.txt');
    expect(result).toBe('mocked data');
  });

  it('should writeFile successfully using the injected mock', async () => {
    (mockFs.writeFile as any).mockImplementation((path: any, data: any, options: any, cb: any) => cb(null));
    (mockFs.writeFile as any).__promisify__ = true;
    (mockPath.dirname as any).mockReturnValue('dir');
    (mockFs.mkdirSync as any).mockImplementation(() => {});
    (adapter as any).exists = jest.fn().mockResolvedValue(false);
    await expect(adapter.writeFile('dir/file.txt', 'data')).resolves.toBeUndefined();
    expect(mockFs.writeFile).toHaveBeenCalled();
    expect(mockFs.mkdirSync).toHaveBeenCalledWith('dir', { recursive: true });
  });

  it('should readdir successfully using the injected mock', async () => {
    // Use callback-style mock for promisify compatibility, supporting both (path, cb) and (path, options, cb)
    (mockFs.readdir as any).mockImplementation((path: any, optionsOrCb: any, maybeCb?: any) => {
      const cb = typeof optionsOrCb === 'function' ? optionsOrCb : maybeCb;
      cb(null, ['file1', 'file2']);
    });
    (mockFs.readdir as any).__promisify__ = true;
    const result = await adapter.readdir('someDir');
    expect(result).toEqual(['file1', 'file2']);
    expect(mockFs.readdir).toHaveBeenCalled();
  });

  it('should check exists returns true when stat succeeds', async () => {
    (mockFs.stat as any).mockImplementation((path: any, cb: any) => cb(null, { isFile: () => true }));
    (mockFs.stat as any).__promisify__ = true;
    const result = await adapter.exists('file.txt');
    expect(result).toBe(true);
  });

  it('should check exists returns false when stat throws', async () => {
    (mockFs.stat as any).mockImplementation((path: any, cb: any) => cb(new Error('not found')));
    (mockFs.stat as any).__promisify__ = true;
    (adapter as any).statAsync = jest.fn().mockRejectedValue(new Error('not found'));
    const result = await adapter.exists('file.txt');
    expect(result).toBe(false);
  });

  it('should check isDirectory returns true when stat returns isDirectory true', async () => {
    const statObj = { isDirectory: () => true };
    (mockFs.stat as any).mockImplementation((path: any, cb: any) => cb(null, statObj));
    (mockFs.stat as any).__promisify__ = true;
    (adapter as any).statAsync = jest.fn().mockResolvedValue(statObj);
    const result = await adapter.isDirectory('dir');
    expect(result).toBe(true);
  });

  it('should check isDirectory returns false when stat throws', async () => {
    (adapter as any).statAsync = jest.fn().mockRejectedValue(new Error('fail'));
    const result = await adapter.isDirectory('dir');
    expect(result).toBe(false);
  });
});
