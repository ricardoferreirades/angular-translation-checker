import { EventBus } from '../types';

/**
 * SimpleEventBus implements a basic event emitter for translation checker lifecycle and plugin events.
 * Allows listeners to subscribe to and emit events during analysis.
 */
export class SimpleEventBus implements EventBus {
  private handlers = new Map<string, Set<Function>>();

  /**
   * Emits an event with the given name and data to all registered handlers.
   * @param {string} event - The event name.
   * @param {T} data - The event data.
   */
  emit<T = any>(event: string, data: T): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          process.stderr.write(`Error in event handler for '${event}': ${error}\n`);
        }
      });
    }
  }

  /**
   * Registers a handler for a specific event.
   * @param {string} event - The event name.
   * @param {(data: T) => void} handler - The handler function.
   */
  on<T = any>(event: string, handler: (data: T) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  /**
   * Removes a handler for a specific event.
   * @param {string} event - The event name.
   * @param {Function} handler - The handler function to remove.
   */
  off(event: string, handler: Function): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
      if (eventHandlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  /**
   * Removes all event handlers for all events.
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Returns a list of all registered event names.
   * @returns {string[]} Array of event names.
   */
  getEventNames(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Returns the number of handlers registered for a specific event.
   * @param {string} event - The event name.
   * @returns {number} Number of handlers for the event.
   */
  getHandlerCount(event: string): number {
    return this.handlers.get(event)?.size || 0;
  }
}
