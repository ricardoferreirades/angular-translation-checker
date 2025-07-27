import { EventBus } from '../types';

export class SimpleEventBus implements EventBus {
  private handlers = new Map<string, Set<Function>>();

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

  on<T = any>(event: string, handler: (data: T) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: Function): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
      if (eventHandlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  clear(): void {
    this.handlers.clear();
  }

  getEventNames(): string[] {
    return Array.from(this.handlers.keys());
  }

  getHandlerCount(event: string): number {
    return this.handlers.get(event)?.size || 0;
  }
}
