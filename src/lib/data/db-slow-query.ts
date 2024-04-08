import crypto from "crypto";

function rounded(value: number): number {
  return Math.round(100 * value) / 100;
}

class QueryFamily {
  private key: string;
  private sql: string;
  private familyAccumulatedLatency: number = 0;
  private familyCount: number = 0;

  constructor(key: string, sql: string) {
    this.key = key;
    this.sql = sql;
  }

  public record(latency: number) {
    this.familyAccumulatedLatency += latency;
    this.familyCount += 1;
  }

  public getStats(): {
    key: string;
    familyCount: number;
    familyAverageLatency: number | undefined;
    familyAccumulatedLatency: number;
  } {
    const key = this.key;
    const familyCount = this.familyCount;
    const familyAccumulatedLatency = this.familyAccumulatedLatency;
    const familyAverageLatency =
      familyCount > 0
        ? rounded(familyAccumulatedLatency / familyCount)
        : undefined;
    return {
      key,
      familyCount,
      familyAverageLatency,
      familyAccumulatedLatency,
    };
  }
}

export class SlowQueryService {
  private queryFamilies: Record<string, QueryFamily>;
  private totalAccumulatedLatency: number = 0;
  private maxLatency: number = 0;
  private maxFamilyAccumulatedLatency: number = 0;

  constructor() {
    this.queryFamilies = {};
  }

  public getTs() {
    return Date.now();
  }

  public submit(sql: string, currentLatency: number) {
    const family = this.getQueryFamily(sql);
    family.record(currentLatency);
    this.totalAccumulatedLatency += currentLatency;

    const { key, familyCount, familyAverageLatency, familyAccumulatedLatency } =
      family.getStats();
    const totalAccumulatedLatency = this.totalAccumulatedLatency;
    const labels = [];
    if (currentLatency > this.maxLatency) {
      labels.push("SLOWEST");
      this.maxLatency = currentLatency;
    }
    if (familyAccumulatedLatency > this.maxFamilyAccumulatedLatency) {
      labels.push("MOST_IMPACT");
      this.maxFamilyAccumulatedLatency = familyAccumulatedLatency;
    }

    console.log(
      JSON.stringify({
        key,
        currentLatency,
        familyCount,
        familyAverageLatency,
        familyAccumulatedLatency,
        totalAccumulatedLatency,
        percentageOfTotal: rounded(
          familyAccumulatedLatency / totalAccumulatedLatency,
        ),
        labels,
      }),
    );
    if (labels.length > 0) {
      console.log(`sql: ${sql}`);
    }
  }

  private getQueryFamily(sql: string): QueryFamily {
    const key = this.digest(sql);
    if (!(key in this.queryFamilies)) {
      const family = new QueryFamily(key, sql);
      this.queryFamilies[key] = family;
    }
    return this.queryFamilies[key];
  }

  private digest(sql: string): string {
    const messageDigest = crypto.createHash("md5");
    messageDigest.update(sql);
    return messageDigest.digest("hex");
  }
}
