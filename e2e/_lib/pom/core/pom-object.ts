import { Locator, Page } from "@playwright/test";
import { Website } from "./website";

export type PomContext = {
  page: Page;
  website: Website;
};

export class PomObject {
  constructor(private ctx: PomContext) {}

  context(): PomContext {
    return this.ctx;
  }

  page(): Page {
    return this.ctx.page;
  }

  website(): Website {
    return this.ctx.website;
  }

  exactText(text: string): Locator {
    return this.page().getByText(text, { exact: true });
  }
}
