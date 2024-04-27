import { Page } from "@playwright/test";
import { PomContext } from "../core/pom-object";
import { Website } from "../core/website";

/**
 * Create and initialise a PomContext at the root of the test website.
 */
export async function initPomContext(args: {
  page: Page;
}): Promise<PomContext> {
  const { page } = args;
  const website = new Website("http://localhost:3000");
  await page.goto(website.urlOf("/"));
  return { page, website };
}
