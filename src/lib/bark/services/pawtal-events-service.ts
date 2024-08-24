import { Semaphore } from "@/lib/utilities/semaphore";
import { BarkContext } from "../bark-context";
import { PawtalEventsDao } from "../daos/pawtal-events-dao";
import { SentEmailEvent } from "../models/email-models";
import { PageLoadEvent } from "../models/tracker-models";
import { PawtalEventType } from "../enums/pawtal-event-type";

export class PawtalEventsService {
  private dao: PawtalEventsDao;
  private sem: Semaphore;

  constructor(private config: { context: BarkContext }) {
    this.dao = new PawtalEventsDao(config.context.dbPool);

    // The semaphore limits the number of concurrent writes to the DAO.
    this.sem = new Semaphore(5);
  }

  async submitPageLoadEvent(args: {
    pageLoadEvent: PageLoadEvent;
  }): Promise<boolean> {
    const { pageLoadEvent } = args;
    await this.sem.acquire();
    const out = await this.dao.insertPageLoadEvent({ pageLoadEvent });
    this.sem.release();
    return out;
  }

  async submitSentEmailEvent(args: {
    sentEmailEvent: SentEmailEvent;
  }): Promise<boolean> {
    const { sentEmailEvent } = args;
    await this.sem.acquire();
    const out = await this.dao.insertSentEmailEvent({ sentEmailEvent });
    this.sem.release();
    return out;
  }

  async getEventCountByType(args: {
    eventType: PawtalEventType;
  }): Promise<{ eventCount: number }> {
    return this.dao.getEventCountByType(args);
  }
}
