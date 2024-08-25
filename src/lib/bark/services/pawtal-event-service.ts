import { Semaphore } from "@/lib/utilities/semaphore";
import { BarkContext } from "../bark-context";
import { PawtalEventDao } from "../daos/pawtal-event-dao";
import { PawtalEventType } from "../enums/pawtal-event-type";
import { PawtalEventSpec } from "../models/event-models";

export class PawtalEventService {
  private dao: PawtalEventDao;
  private sem: Semaphore;

  constructor(private config: { context: BarkContext }) {
    this.dao = new PawtalEventDao(config.context.dbPool);

    // The semaphore limits the number of concurrent writes to the DAO.
    this.sem = new Semaphore(5);
  }

  async submit(args: { spec: PawtalEventSpec }): Promise<void> {
    const { spec } = args;
    await this.sem.acquire();
    try {
      await this.dao.insert({ spec });
    } finally {
      this.sem.release();
    }
  }

  async getEventCountByType(args: {
    eventType: PawtalEventType;
  }): Promise<{ eventCount: number }> {
    return this.dao.getEventCountByType(args);
  }
}
