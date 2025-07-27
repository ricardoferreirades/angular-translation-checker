import { Logger } from '../types';

export class ConsoleLogger implements Logger {
  constructor(private isVerbose: boolean = false) {}

  info(message: string, ...args: any[]): void {
    process.stdout.write(`ℹ️ ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
  }

  warn(message: string, ...args: any[]): void {
    process.stderr.write(`⚠️ ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
  }

  error(message: string, ...args: any[]): void {
    process.stderr.write(`❌ ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
  }

  debug(message: string, ...args: any[]): void {
    if (this.isVerbose) {
      process.stdout.write(`🐛 ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
    }
  }

  verbose(message: string, ...args: any[]): void {
    if (this.isVerbose) {
      process.stdout.write(`📝 ${message}${args.length ? ' ' + args.join(' ') : ''}\n`);
    }
  }

  setVerbose(verbose: boolean): void {
    this.isVerbose = verbose;
  }
}

export class SilentLogger implements Logger {
  info(): void {}
  warn(): void {}
  error(): void {}
  debug(): void {}
  verbose(): void {}
}
