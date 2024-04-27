import { PomObject } from "./pom-object";

import { expect } from "@playwright/test";

export abstract class PomDynamicPage extends PomObject {
  abstract urlRegex(): RegExp;

  async checkUrl() {
    await expect(this.page()).toHaveURL(this.urlRegex());
  }
}
