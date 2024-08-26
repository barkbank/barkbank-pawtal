import cron from "node-cron";

import { PAWTAL_EVENT_TYPE } from "../enums/pawtal-event-type";
import { JSONValue } from "@/lib/utilities/json-schema";
import { PawtalEventService } from "./pawtal-event-service";
import { PawtalEventSpec } from "../models/event-models";

export type CronTask = {
  taskSchedule: string;
  taskName: string;
  runTask: () => Promise<JSONValue>;
};

export class CronService {
  constructor(
    private config: {
      tasks: CronTask[];
      instanceId: string;
      pawtalEventService: PawtalEventService;
    },
  ) {}
  start() {
    const { tasks } = this.config;
    for (const task of tasks) {
      this.schedule(task);
    }
  }

  private schedule(task: CronTask) {
    const { instanceId, pawtalEventService } = this.config;
    const { taskSchedule, taskName, runTask } = task;
    cron.schedule(taskSchedule, () => {
      const t0 = Date.now();
      runTask().then((taskOutput) => {
        const t1 = Date.now();
        const runMillis = t1 - t0;
        const spec: PawtalEventSpec = {
          eventTs: new Date(),
          eventType: PAWTAL_EVENT_TYPE.CRON_RUN,
          eventData: {
            taskName,
            taskSchedule,
            taskOutput,
            runMillis,
            instanceId,
          },
        };
        pawtalEventService.submit({ spec });
      });
    });
  }
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
  EVERYDAY_AT_0200_SGT: "0 18 * * *",
} as const;
