import { PomObject } from "./pom-object";

import { Locator, expect } from "@playwright/test";

export abstract class PomPage extends PomObject {
  abstract url(): string;

  /**
   * Check ready checks the URL and one evidence of page loaded. Override the
   * checkPageLoaded method to customise the behaviour for the page.
   */
  async checkReady() {
    await this.checkUrl();
    await this.checkPageLoaded();
  }

  async checkUrl() {
    await expect(this.page()).toHaveURL(this.url());
  }

  /**
   * Typically you should be calling checkReady(), which will check URL and
   * page-loaded.
   *
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
