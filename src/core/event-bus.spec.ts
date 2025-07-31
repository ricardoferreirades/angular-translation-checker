import { SimpleEventBus } from './event-bus';

describe('SimpleEventBus', () => {
  it('should not fail when emitting an event with no handlers', () => {
    expect(() => bus.emit('nohandlers', 'data')).not.toThrow();
  });

  it('should not fail when removing handler for non-existent event', () => {
    const handler = jest.fn();
    expect(() => bus.off('noevent', handler)).not.toThrow();
  });

  it('should not fail when removing non-existent handler', () => {
    const handler = jest.fn();
    bus.on('event', () => {});
    expect(() => bus.off('event', handler)).not.toThrow();
  });

  it('should return 0 handler count for non-existent event', () => {
    expect(bus.getHandlerCount('noevent')).toBe(0);
  });

  it('should clear handlers on empty bus', () => {
    expect(() => bus.clear()).not.toThrow();
    expect(bus.getEventNames()).toEqual([]);
  });
  let bus: SimpleEventBus;

  beforeEach(() => {
    bus = new SimpleEventBus();
  });

  it('should register and emit events', () => {
    const handler = jest.fn();
    bus.on('test', handler);
    bus.emit('test', { foo: 'bar' });
    expect(handler).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should support multiple handlers for the same event', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    bus.on('multi', handler1);
    bus.on('multi', handler2);
    bus.emit('multi', 42);
    expect(handler1).toHaveBeenCalledWith(42);
    expect(handler2).toHaveBeenCalledWith(42);
  });

  it('should remove handlers with off()', () => {
    const handler = jest.fn();
    bus.on('remove', handler);
    bus.off('remove', handler);
    bus.emit('remove', 'data');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should clear all handlers', () => {
    const handler = jest.fn();
    bus.on('clear', handler);
    bus.clear();
    bus.emit('clear', 'data');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should return event names', () => {
    bus.on('a', () => {});
    bus.on('b', () => {});
    expect(bus.getEventNames().sort()).toEqual(['a', 'b']);
  });

  it('should return handler count for event', () => {
    const h1 = () => {};
    const h2 = () => {};
    bus.on('count', h1);
    bus.on('count', h2);
    expect(bus.getHandlerCount('count')).toBe(2);
    bus.off('count', h1);
    expect(bus.getHandlerCount('count')).toBe(1);
    bus.off('count', h2);
    expect(bus.getHandlerCount('count')).toBe(0);
  });

  it('should handle errors in event handlers gracefully', () => {
    const errorHandler = jest.fn(() => { throw new Error('fail'); });
    const normalHandler = jest.fn();
    bus.on('err', errorHandler);
    bus.on('err', normalHandler);
    const spy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    bus.emit('err', 'data');
    expect(normalHandler).toHaveBeenCalledWith('data');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Error in event handler for 'err': Error: fail"));
    spy.mockRestore();
  });
});
