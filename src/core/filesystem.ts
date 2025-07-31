
import { FileSystemAdapter } from '../types';
import { promisify } from 'util';

export interface NodeFs {
  readFile: typeof import('fs').readFile;
  writeFile: typeof import('fs').writeFile;
  readdir: typeof import('fs').readdir;
  stat: typeof import('fs').stat;
  mkdirSync: typeof import('fs').mkdirSync;
  promises?: {
    readFile?: typeof import('fs').promises.readFile;
    writeFile?: typeof import('fs').promises.writeFile;
    readdir?: typeof import('fs').promises.readdir;
    stat?: typeof import('fs').promises.stat;
  };
}

export interface NodePath {
  dirname: typeof import('path').dirname;
  join: typeof import('path').join;
  relative: typeof import('path').relative;
}


/**
 * NodeFileSystemAdapter implements the FileSystemAdapter interface using Node.js fs and path modules.
 * It provides asynchronous file and directory operations, globbing, and utility methods for translation analysis.
 * This adapter is designed for testability and platform independence, abstracting direct Node.js API usage.
 */
export class NodeFileSystemAdapter implements FileSystemAdapter {
  private fs: NodeFs;
  private path: NodePath;
  private readFileAsync: (path: string, options?: any) => Promise<any>;
  private writeFileAsync: (path: string, data: any, options?: any) => Promise<any>;
  private readdirAsync: (path: string) => Promise<string[]>;
  private statAsync: (path: string) => Promise<any>;

  /**
   * NodeFileSystemAdapter provides file system operations (read, write, glob, readdir) for translation analysis.
   * Abstracts Node.js fs and path APIs for testability and platform independence.
   */
  constructor(fsModule?: NodeFs, pathModule?: NodePath) {
    this.fs = fsModule || require('fs');
    this.path = pathModule || require('path');
    this.readFileAsync = promisify(this.fs.readFile);
    this.writeFileAsync = promisify(this.fs.writeFile);
    this.readdirAsync = promisify(this.fs.readdir);
    this.statAsync = promisify(this.fs.stat);
  }

  /**
   * Reads the contents of a file as a UTF-8 string.
   * @param {string} filePath - Path to the file.
   * @returns {Promise<string>} The file contents.
   * @throws {Error} If reading fails.
   */
  async readFile(filePath: string): Promise<string> {
    try {
      return await this.readFileAsync(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
  }

  /**
   * Writes content to a file, creating directories as needed.
   * @param {string} filePath - Path to the file.
   * @param {string} content - Content to write.
   * @returns {Promise<void>}
   * @throws {Error} If writing fails.
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      // Ensure directory exists
      const dir = this.path.dirname(filePath);
      if (!await this.exists(dir)) {
        this.fs.mkdirSync(dir, { recursive: true });
      }
      await this.writeFileAsync(filePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error}`);
    }
  }

  /**
   * Reads the contents of a directory.
   * @param {string} dirPath - Path to the directory.
   * @returns {Promise<string[]>} List of file and directory names.
   * @throws {Error} If reading fails.
   */
  async readdir(dirPath: string): Promise<string[]> {
    try {
      return await this.readdirAsync(dirPath);
    } catch (error) {
      throw new Error(`Failed to read directory ${dirPath}: ${error}`);
    }
  }

  /**
   * Checks if a file or directory exists.
   * @param {string} filePath - Path to check.
   * @returns {Promise<boolean>} True if exists, false otherwise.
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      await this.statAsync(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if a path is a directory.
   * @param {string} filePath - Path to check.
   * @returns {Promise<boolean>} True if directory, false otherwise.
   */
  async isDirectory(filePath: string): Promise<boolean> {
    try {
      const stats = await this.statAsync(filePath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Finds files matching a glob pattern, using modern glob if available, otherwise a fallback.
   * @param {string} pattern - Glob pattern.
   * @param {any} [options={}] - Glob options (e.g., cwd).
   * @returns {Promise<string[]>} List of matching file paths.
   */
  async glob(pattern: string, options: any = {}): Promise<string[]> {
    try {
      // Try to use the modern glob API with dynamic import
      const globModule = await import('glob');
      const globFunc = globModule.glob || globModule.default || globModule;
      if (typeof globFunc === 'function') {
        const results = await globFunc(pattern, options);
        return Array.isArray(results) ? results : [];
      }
    } catch (error) {
      // Fall back to basic implementation
    }
    return this.basicGlob(pattern, options.cwd || process.cwd());
  }

  /**
   * Fallback implementation for globbing files recursively from a base path.
   * @param {string} pattern - Glob pattern.
   * @param {string} basePath - Base directory to search from.
   * @returns {Promise<string[]>} List of matching file paths.
   * @private
   */
  private async basicGlob(pattern: string, basePath: string): Promise<string[]> {
    const results: string[] = [];
    try {
      await this.walkDirectory(basePath, (filePath) => {
        const relativePath = this.path.relative(basePath, filePath);
        if (this.matchesPattern(relativePath, pattern)) {
          results.push(filePath);
        }
      });
    } catch (error) {
      throw new Error(`Glob operation failed for pattern ${pattern}: ${error}`);
    }
    return results;
  }

  /**
   * Recursively walks a directory, calling a callback for each file found.
   * @param {string} dirPath - Directory to walk.
   * @param {(filePath: string) => void} callback - Callback for each file.
   * @returns {Promise<void>}
   * @private
   */
  private async walkDirectory(
    dirPath: string,
    callback: (filePath: string) => void
  ): Promise<void> {
    const entries = await this.readdir(dirPath);
    for (const entry of entries) {
      const fullPath = this.path.join(dirPath, entry);
      try {
        if (await this.isDirectory(fullPath)) {
          await this.walkDirectory(fullPath, callback);
        } else {
          callback(fullPath);
        }
      } catch (error) {
        // Skip files that can't be accessed
        continue;
      }
    }
  }

  /**
   * Checks if a file path matches a glob pattern (basic implementation).
   * @param {string} filePath - File path to check.
   * @param {string} pattern - Glob pattern.
   * @returns {boolean} True if matches, false otherwise.
   * @private
   */
  private matchesPattern(filePath: string, pattern: string): boolean {
    // Convert glob pattern to regex
    let regexPattern = pattern
      .replace(/\*\*/g, '.*')  // ** matches any number of directories
      .replace(/\*/g, '[^/]*') // * matches any characters except path separator
      .replace(/\?/g, '.')     // ? matches single character
      .replace(/\./g, '\\.');  // Escape dots
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath.replace(/\\/g, '/'));
  }
}
