import { PomObject } from "./pom-object";

import { expect, Locator } from "@playwright/test";

export abstract class PomPage extends PomObject {
  abstract url(): string;

  async checkUrl() {
    await expect(this.page()).toHaveURL(this.url());
  }

  exactText(text: string): Locator {
    return this.page().getByText(text, { exact: true });
  }
}
