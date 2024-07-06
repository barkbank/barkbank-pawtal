import { PomObject } from "./pom-object";

import { Locator, expect } from "@playwright/test";

export abstract class PomPage extends PomObject {
  abstract url(): string;

  async checkReady() {
    await expect(this.page()).toHaveURL(this.url());
  }

  async goto() {
    await this.page().goto(this.url());
    await this.checkReady();
  }

  exactText(text: string): Locator {
    return this.page().getByText(text, { exact: true });
  }
}
