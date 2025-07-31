import { Logger } from '../types';

/**
 * ConsoleLogger provides logging to stdout/stderr with optional verbosity for debugging translation analysis.
 */
export class ConsoleLogger implements Logger {

  /**
   * Creates a new ConsoleLogger.
   * @param {boolean} [isVerbose=false] - Whether to enable verbose/debug output.
   */
  constructor(private isVerbose: boolean = false) {}

  /**
   * Logs an informational message to stdout.
   * @param {string} message - The message to log.
   * @param {...any[]} args - Additional arguments to log.
   */
  info(message: string, ...args: any[]): void {
    process.stdout.write(`ℹ️ ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
  }

  /**
   * Logs a warning message to stderr.
   * @param {string} message - The warning message.
   * @param {...any[]} args - Additional arguments to log.
   */
  warn(message: string, ...args: any[]): void {
    process.stderr.write(`⚠️ ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
  }

  /**
   * Logs an error message to stderr.
   * @param {string} message - The error message.
   * @param {...any[]} args - Additional arguments to log.
   */
  error(message: string, ...args: any[]): void {
    process.stderr.write(`❌ ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
  }

  /**
   * Logs a debug message to stdout if verbose mode is enabled.
   * @param {string} message - The debug message.
   * @param {...any[]} args - Additional arguments to log.
   */
  debug(message: string, ...args: any[]): void {
    if (this.isVerbose) {
      process.stdout.write(`🐛 ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
    }
  }

  /**
   * Logs a verbose message to stdout if verbose mode is enabled.
   * @param {string} message - The verbose message.
   * @param {...any[]} args - Additional arguments to log.
   */
  verbose(message: string, ...args: any[]): void {
    if (this.isVerbose) {
      process.stdout.write(`📝 ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
    }
  }

  /**
   * Enables or disables verbose/debug output.
   * @param {boolean} verbose - True to enable verbose output, false to disable.
   */
  setVerbose(verbose: boolean): void {
    this.isVerbose = verbose;
  }
}

/**
 * SilentLogger is a no-op logger that suppresses all log output, useful for testing or silent operation.
 */
export class SilentLogger implements Logger {
  /**
   * No-op for info messages (SilentLogger).
   */
  info(): void {}
  /**
   * No-op for warning messages (SilentLogger).
   */
  warn(): void {}
  /**
   * No-op for error messages (SilentLogger).
   */
  error(): void {}
  /**
   * No-op for debug messages (SilentLogger).
   */
  debug(): void {}
  /**
   * No-op for verbose messages (SilentLogger).
   */
  verbose(): void {}
}
