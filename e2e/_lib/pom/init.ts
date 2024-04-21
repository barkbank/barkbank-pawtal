import { Page } from "@playwright/test";
import { Website } from "./website";
import { PomContext } from "./pom-context";

export function getTestWebsite(): Website {
  return new Website("http://localhost:3000");
}

/**
 * Create and initialise a PomContext at the root of the test website.
 */
export async function initPomContext(page: Page): Promise<PomContext> {
  const website = getTestWebsite();
  await page.goto(website.urlOf("/"));
  return { page, website };
}
