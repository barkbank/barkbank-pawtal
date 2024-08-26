import cron from "node-cron";

import { BarkContext } from "../bark-context";
import { dbQuery } from "@/lib/data/db-utils";
import { opLogPawtalEvent } from "../operations/op-log-pawtal-event";
import { PAWTAL_EVENT_TYPE } from "../enums/pawtal-event-type";
import { JSONValue } from "@/lib/utilities/json-schema";

export type CronTask = {
  schedule: string;
  name: string;
  run: () => Promise<JSONValue>;
};

export class CronService {
  constructor(private args: { context: BarkContext; instanceId: string }) {}
  start() {
    const { context } = this.args;
    this.schedule(new _PingDatatbaseTask({ context }));
  }

  private schedule(task: _Task) {
    const instanceId = this.args.instanceId;
    cron.schedule(task.getSchedule(), () => {
      task.run().then((res) => {
        const eventType = PAWTAL_EVENT_TYPE.CRON_RUN;
        const taskName = task.getName();
        const taskOut = res;
        opLogPawtalEvent({
          eventType,
          params: { instanceId, taskName, taskOut },
        });
      });
    });
  }
}

interface _Task {
  getName(): string;

  /**
   * https://www.npmjs.com/package/node-cron
   *
   *    ┌────────────── second (optional)
   *    │ ┌──────────── minute
   *    │ │ ┌────────── hour
   *    │ │ │ ┌──────── day of month
   *    │ │ │ │ ┌────── month
   *    │ │ │ │ │ ┌──── day of week
   *    │ │ │ │ │ │
   *    │ │ │ │ │ │
   *    * * * * * *
   *      * * * * *
   */
  getSchedule(): string;

  run(): Promise<Record<string, any>>;
}

/**
 * https://www.npmjs.com/package/node-cron
 *
 *    ┌────────────── second (optional)
 *    │ ┌──────────── minute
 *    │ │ ┌────────── hour
 *    │ │ │ ┌──────── day of month
 *    │ │ │ │ ┌────── month
 *    │ │ │ │ │ ┌──── day of week
 *    │ │ │ │ │ │
 *    │ │ │ │ │ │
 *    * * * * * *
 *      * * * * *
 */
export const CRON_SCHEDULE = {
  EVERY_5_SECONDS: "*/5 * * * * *",
  AT_0200_SGT_EVERYDAY: "0 18 * * *",
} as const;

/**
 * Ping the database once a day at 18:00 UTC (i.e. 02:00 SGT).
 */
class _PingDatatbaseTask implements _Task {
  constructor(private args: { context: BarkContext }) {}

  getName(): string {
    return "_PingDatatbaseTask";
  }

  getSchedule(): string {
    return CRON_SCHEDULE.AT_0200_SGT_EVERYDAY;
  }

  async run(): Promise<Record<string, any>> {
    const res = await dbQuery<{ ping: number }>(
      this.args.context.dbPool,
      `SELECT 1 as "ping"`,
      [],
    );
    return res.rows[0];
  }
}
