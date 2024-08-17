import { PomObject } from "./pom-object";

import { Locator, expect } from "@playwright/test";

export abstract class PomPage extends PomObject {
  abstract url(): string;

  /**
   * Call this to check that we are at the correct URL and the page is loaded.
   *
   * Override checkPageLoaded to customise what constitutes a loaded page. By
   * default it checks nothing.
   */
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
   *
   * For readiness check, please call checkReady(). It will check both URL and
   * page-loaded.
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
