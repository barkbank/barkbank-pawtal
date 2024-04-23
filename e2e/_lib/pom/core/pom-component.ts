import { PomObject } from "./pom-object";

import { Locator } from "@playwright/test";

export abstract class PomComponent extends PomObject {
  abstract locator(): Locator;
}
