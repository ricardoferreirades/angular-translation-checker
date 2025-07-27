import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { FileSystemAdapter } from '../types';

// Promisify fs methods
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

export class NodeFileSystemAdapter implements FileSystemAdapter {
  async readFile(filePath: string): Promise<string> {
    try {
      return await readFileAsync(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!await this.exists(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      await writeFileAsync(filePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error}`);
    }
  }

  async readdir(dirPath: string): Promise<string[]> {
    try {
      return await readdirAsync(dirPath);
    } catch (error) {
      throw new Error(`Failed to read directory ${dirPath}: ${error}`);
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await statAsync(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async isDirectory(filePath: string): Promise<boolean> {
    try {
      const stats = await statAsync(filePath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

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

  private async basicGlob(pattern: string, basePath: string): Promise<string[]> {
    const results: string[] = [];
    
    try {
      await this.walkDirectory(basePath, (filePath) => {
        const relativePath = path.relative(basePath, filePath);
        if (this.matchesPattern(relativePath, pattern)) {
          results.push(filePath);
        }
      });
    } catch (error) {
      throw new Error(`Glob operation failed for pattern ${pattern}: ${error}`);
    }

    return results;
  }

  private async walkDirectory(
    dirPath: string, 
    callback: (filePath: string) => void
  ): Promise<void> {
    const entries = await this.readdir(dirPath);
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      
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
