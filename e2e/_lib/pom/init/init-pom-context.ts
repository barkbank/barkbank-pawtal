import { Page } from "@playwright/test";
import { PomContext } from "../core/pom-object";
import { Website } from "../core/website";

/**
 * Create and initialise a PomContext at the root of the test website.
 */
export async function initPomContext(page: Page): Promise<PomContext> {
  const website = new Website("http://localhost:3000");
  await page.goto(website.urlOf("/"));
  return { page, website };
}
