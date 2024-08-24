import { Queue } from "./queue";

export class Semaphore {
  private permits: number;
  private queue: Queue<() => void>;

  constructor(permits: number) {
    if (permits < 0) {
      throw new Error("Semaphore initialised with negative permits");
    }
    this.permits = permits;
    this.queue = new Queue<() => void>();
  }

  public async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits -= 1;
    } else {
      await new Promise<void>((resolve) => this.queue.offer(resolve));
    }
  }

  public release(): void {
    const next = this.queue.poll();
    if (next) {
      next();
    } else {
      this.permits += 1;
    }
  }

  public getAvailablePermits(): number {
    return this.permits;
  }
}
