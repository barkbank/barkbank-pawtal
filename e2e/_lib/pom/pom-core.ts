import { Locator, Page, expect } from "@playwright/test";
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
}

export abstract class PomPage extends PomObject {
  abstract url(): string;

  async checkUrl() {
    await expect(this.page()).toHaveURL(this.url());
  }

  exactText(text: string): Locator {
    return this.page().getByText(text, { exact: true });
  }
}

export abstract class PomComponent extends PomObject {
  abstract locator(): Locator;
}
