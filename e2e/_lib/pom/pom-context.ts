import { Page } from "@playwright/test";
import { Website } from "./website";

export type PomContext = {
  page: Page;
  website: Website;
};
