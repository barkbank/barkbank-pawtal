import { PomObject } from "./pom-object";

import { Locator, expect } from "@playwright/test";

export abstract class PomPage extends PomObject {
  abstract url(): string;

  async checkReady() {
    await this.checkUrl();
    await this.checkPageLoaded();
  }

  async checkUrl() {
    await expect(this.page()).toHaveURL(this.url());
  }

  /**
   * Override this if there are things to check that demonstrate the page has
   * loaded successfully.
   */
  async checkPageLoaded() {
    // Do nothing.
  }

  async goto() {
    await this.page().goto(this.url());
    await this.checkReady();
  }

  exactText(text: string): Locator {
    return this.page().getByText(text, { exact: true });
  }
}
