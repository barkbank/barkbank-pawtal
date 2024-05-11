import { PomObject } from "./pom-object";

import { Locator } from "@playwright/test";

export abstract class PomComponent extends PomObject {
  abstract locator(): Locator;

  exactText(text: string): Locator {
    return this.locator().getByText(text, { exact: true });
  }
}
