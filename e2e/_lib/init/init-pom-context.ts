import { Page } from "@playwright/test";
import { PomContext } from "../pom/core/pom-object";
import { Website } from "../pom/core/website";

/**
 * Create and initialise a PomContext at the root of the test website.
 */
export async function initPomContext(args: {
  page: Page;
}): Promise<PomContext> {
  const { page } = args;
  const website = _initWebsite();
  await page.goto(website.urlOf("/"));
  return { page, website };
}

function _initWebsite(): Website {
  return new Website("http://localhost:3000");
}
