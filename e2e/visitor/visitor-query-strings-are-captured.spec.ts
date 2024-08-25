import test, { expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { toString } from "lodash";
import { RoutePath } from "@/lib/route-path";
import { ApiClient } from "../_lib/pom/api/api-client";

test("query strings are captured", async ({ page, request }) => {
  const context = await initPomContext({ page });
  const nonce = toString(Math.floor(Math.random() * 1000000000));
  const queryString = `nonce=${nonce}`;
  const path = `${RoutePath.USER_LOGIN_PAGE}?${queryString}`;
  const url = context.website.urlOf(path);
  await page.goto(url);

  const api = new ApiClient(context, request);
  const sql = `
  SELECT COUNT(*)::INTEGER as "Count"
  FROM pawtal_events
  WHERE event_data->'queryParams'->>'nonce' = $1
  `;
  const rows = await api.sql(sql, [nonce]);
  expect(rows[0]["Count"]).toEqual(1);
});
