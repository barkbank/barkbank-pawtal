import { PomObject } from "./pom-object";

import { expect } from "@playwright/test";

export abstract class PomPage extends PomObject {
  abstract url(): string;

  async checkUrl() {
    await expect(this.page()).toHaveURL(this.url());
  }
}
