import crypto from "crypto";

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
    totalLatency: number;
  } {
    return {
      key: this.key,
      sql: this.sql,
      count: this.getCount(),
      averageLatency: this.getAverageLatency(),
      totalLatency: this.getTotalLatency(),
    };
  }

  private getCount(): number {
    return this.callCount;
  }

  private getAverageLatency(): number | undefined {
    if (this.callCount === 0) {
      return undefined;
    }
    return this.latencySum / this.callCount;
  }

  private getTotalLatency(): number {
    return this.latencySum;
  }
}

export class SlowQueryService {
  private trackers: Record<string, QueryTracker>;
  private maxLatency: number = 0;
  private maxTotalLatency: number = 0;

  constructor() {
    this.trackers = {};
  }

  public getTs() {
    return new Date().getTime();
  }

  public submit(sql: string, latency: number) {
    const tracker = this.getQueryTracker(sql);
    tracker.record(latency);
    const { key, count, averageLatency, totalLatency } = tracker.getStats();
    const labels = [];
    if (latency > this.maxLatency) {
      labels.push("SLOWEST");
      this.maxLatency = latency;
    }
    if (totalLatency > this.maxTotalLatency) {
      labels.push("MOST_IMPACT");
      this.maxTotalLatency = totalLatency;
    }
    console.log(
      JSON.stringify({
        key,
        latency,
        count,
        averageLatency,
        totalLatency,
        labels,
      }),
    );
    if (labels.length > 0) {
      console.log(`sql: ${sql}`);
    }
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
