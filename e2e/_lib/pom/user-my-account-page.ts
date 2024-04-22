import { Page } from "@playwright/test";
import { PomContext } from "./pom-context";

export class UserMyAccountPage {
  constructor(public ctx: PomContext) {}

  public page(): Page {
    return this.ctx.page;
  }
}