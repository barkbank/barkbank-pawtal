import crypto from 'crypto';
import { guaranteed } from '../utilities/bark-utils';


class QueryTracker {
  private key: string;
  private sql: string;
  private latencySum: number = 0;
  private callCount: number = 0;

  constructor(key: string, sql: string) {
    this.key = key;
    this.sql = sql;
  }

  public record(latency: number) {
    this.latencySum += latency;
    this.callCount += 1;
  }

  public getStats(): {
    key: string;
    sql: string;
    count: number;
    averageLatency: number | undefined;
  } {
    return {
      key: this.key,
      sql: this.sql,
      count: this.getCount(),
      averageLatency: this.getAverageLatency(),
    }
  }

  public getCount(): number {
    return this.callCount;
  }

  public getAverageLatency() : number | undefined {
    if (this.callCount === 0) {
      return undefined;
    }
    return this.latencySum / this.callCount;
  }

  public getTotalLatency() : number {
    return this.latencySum;
  }
}


export class SlowQueryService {
  private trackers: Record<string, QueryTracker>
  private queryCount: number = 0;
  private totalLatency: number = 0;
  private maxLatency: number = 0;
  private maxTotalLatency: number = 0;

  constructor() {
    this.trackers = {};
  }

  public getTs() {
    return new Date().getTime();
  }

  public submit(sql: string, latency: number) {
    this.queryCount += 1;
    this.totalLatency += latency;
    const tracker = this.getQueryTracker(sql);
    tracker.record(latency);
    const {key, count, averageLatency} = tracker.getStats();
    const labels = [];
    if (latency > this.maxLatency) {
      labels.push("SLOWEST");
      this.maxLatency = latency;
    }
    if (tracker.getTotalLatency() > this.maxTotalLatency) {
      labels.push("MOST_IMPACT");
      this.maxTotalLatency = tracker.getTotalLatency();
    }
    console.log(JSON.stringify({key, latency, count, averageLatency, labels}));
    if (labels.length > 0) {
      console.log(`sql: ${sql}`);
    }
  }

  private getAverageLatency(): number | undefined {
    if (this.queryCount === 0) {
      return undefined;
    }
    return this.totalLatency / this.queryCount;
  }

  private getQueryTracker(sql: string): QueryTracker {
    const key = this.digest(sql);
    if (!(key in this.trackers)) {
      const tracker = new QueryTracker(key, sql);
      this.trackers[key] = tracker;
    }
    return this.trackers[key];
  }

  private digest(sql: string): string {
    const messageDigest = crypto.createHash("md5");
    messageDigest.update(sql);
    return messageDigest.digest("hex");
  }
}
