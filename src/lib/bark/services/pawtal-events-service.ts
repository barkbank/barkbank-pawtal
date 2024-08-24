import { BarkContext } from "../bark-context";
import { PawtalEventsDao } from "../daos/pawtal-events-dao";
import { SentEmailEvent } from "../models/email-models";
import { PageLoadEvent } from "../models/tracker-models";

export class PawtalEventsService {
  private dao: PawtalEventsDao;
  constructor(private config: { context: BarkContext }) {
    this.dao = new PawtalEventsDao(config.context.dbPool);
  }

  async submitPageLoadEvent(args: {
    pageLoadEvent: PageLoadEvent;
  }): Promise<boolean> {
    const { pageLoadEvent } = args;
    return this.dao.insertPageLoadEvent({ pageLoadEvent });
  }

  async submitSentEmailEvent(args: {
    sentEmailEvent: SentEmailEvent;
  }): Promise<boolean> {
    const { sentEmailEvent } = args;
    return this.dao.insertSentEmailEvent({ sentEmailEvent });
  }
}
