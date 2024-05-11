import { PomObject } from "./pom-object";

import { Locator, expect } from "@playwright/test";

export abstract class PomDynamicPage extends PomObject {
  abstract urlRegex(): RegExp;

  async checkUrl() {
    await expect(this.page()).toHaveURL(this.urlRegex());
  }

  exactText(text: string): Locator {
    return this.page().getByText(text, { exact: true });
  }
}
