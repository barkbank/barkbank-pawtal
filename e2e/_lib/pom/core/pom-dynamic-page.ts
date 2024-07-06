import { PomObject } from "./pom-object";

import { Locator, expect } from "@playwright/test";

export abstract class PomDynamicPage extends PomObject {
  abstract urlRegex(): RegExp;

  async checkReady() {
    await this.checkUrl();
    await this.checkPageLoaded();
  }

  async checkUrl() {
    await expect(this.page()).toHaveURL(this.urlRegex());
  }

  /**
   * Override this if there are things to check that demonstrate the page has
   * loaded successfully.
   */
  async checkPageLoaded() {
    // Do nothing.
  }

  exactText(text: string): Locator {
    return this.page().getByText(text, { exact: true });
  }
}
