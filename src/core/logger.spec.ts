import { ConsoleLogger, SilentLogger } from './logger';

describe('ConsoleLogger', () => {

  it('should respect isVerbose constructor param', () => {
    const verboseLogger = new ConsoleLogger(true);
    const nonVerboseLogger = new ConsoleLogger(false);
    const spyOut = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    verboseLogger.debug('debug verbose');
    verboseLogger.verbose('verbose verbose');
    expect(spyOut).toHaveBeenCalledWith(expect.stringContaining('debug verbose'));
    expect(spyOut).toHaveBeenCalledWith(expect.stringContaining('verbose verbose'));
    spyOut.mockClear();
    nonVerboseLogger.debug('should not print');
    nonVerboseLogger.verbose('should not print');
    expect(spyOut).not.toHaveBeenCalledWith(expect.stringContaining('should not print'));
    spyOut.mockRestore();
  });

  it('should update verbosity with setVerbose', () => {
    const logger = new ConsoleLogger(false);
    const spyOut = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.debug('not verbose');
    logger.verbose('not verbose');
    expect(spyOut).not.toHaveBeenCalledWith(expect.stringContaining('not verbose'));
    logger.setVerbose(true);
    logger.debug('now verbose');
    logger.verbose('now verbose');
    expect(spyOut).toHaveBeenCalledWith(expect.stringContaining('now verbose'));
    spyOut.mockRestore();
  });
  it('should write correct info, warn, error, debug, and verbose messages', () => {
    const spyOut = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const spyErr = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    logger.info('info message', 'extra');
    logger.warn('warn message', 'extra');
    logger.error('error message', 'extra');
    logger.debug('debug message', 'extra');
    logger.verbose('verbose message', 'extra');
    expect(spyOut).toHaveBeenCalledWith(expect.stringContaining('ℹ️ info message extra'));
    expect(spyErr).toHaveBeenCalledWith(expect.stringContaining('⚠️ warn message extra'));
    expect(spyErr).toHaveBeenCalledWith(expect.stringContaining('❌ error message extra'));
    expect(spyOut).toHaveBeenCalledWith(expect.stringContaining('🐛 debug message extra'));
    expect(spyOut).toHaveBeenCalledWith(expect.stringContaining('📝 verbose message extra'));
    spyOut.mockRestore();
    spyErr.mockRestore();
  });
  let logger: ConsoleLogger;
  beforeEach(() => {
    logger = new ConsoleLogger(true);
  });

  it('should not throw for all log methods', () => {
    expect(() => logger.info('info')).not.toThrow();
    expect(() => logger.warn('warn')).not.toThrow();
    expect(() => logger.error('error')).not.toThrow();
    expect(() => logger.debug('debug')).not.toThrow();
    expect(() => logger.verbose('verbose')).not.toThrow();
  });

  it('should toggle verbosity', () => {
    logger.setVerbose(false);
    expect(() => logger.debug('debug')).not.toThrow();
    expect(() => logger.verbose('verbose')).not.toThrow();
  });
});

describe('SilentLogger', () => {
  let logger: SilentLogger;
  beforeEach(() => {
    logger = new SilentLogger();
  });

  it('should not throw for all log methods', () => {
    expect(() => logger.info()).not.toThrow();
    expect(() => logger.warn()).not.toThrow();
    expect(() => logger.error()).not.toThrow();
    expect(() => logger.debug()).not.toThrow();
    expect(() => logger.verbose()).not.toThrow();
  });
});
