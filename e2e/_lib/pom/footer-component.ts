import { Locator } from "@playwright/test";
import { PomComponent } from "./pom-core";

export class FooterComponent extends PomComponent {
  locator(): Locator {
    return this.page().locator("#bark-footer");
  }
}
