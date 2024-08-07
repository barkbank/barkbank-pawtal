import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { RoutePath } from "@/lib/route-path";
import { doLoginKnownVet } from "../_lib/ops/do-login-known-vet";
import { doLoginKnownAdmin } from "../_lib/ops/do-login-known-admin";
import { doLoginKnownUser } from "../_lib/ops/do-login-known-user";

test("should redirect visitor to user login page", async ({ page }) => {
  const context = await initPomContext({ page });
  const rootUrl = context.website.urlOf("/");
  const expectedUrl = context.website.urlOf(RoutePath.USER_LOGIN_PAGE);
  await page.goto(rootUrl);
  await expect(page).toHaveURL(expectedUrl);
});

test("should redirect logged-in user to my pets page", async ({ page }) => {
  const context = await initPomContext({ page });
  await doLoginKnownUser(context);
  const rootUrl = context.website.urlOf("/");
  const expectedUrl = context.website.urlOf(RoutePath.USER_MY_PETS);
  await page.goto(rootUrl);
  await expect(page).toHaveURL(expectedUrl);
});

test("should redirect logged-in vet to vet dashboard", async ({ page }) => {
  const context = await initPomContext({ page });
  await doLoginKnownVet(context);
  const rootUrl = context.website.urlOf("/");
  const expectedUrl = context.website.urlOf(
    RoutePath.VET_SCHEDULE_APPOINTMENTS,
  );
  await page.goto(rootUrl);
  await expect(page).toHaveURL(expectedUrl);
});

test("should redirect logged-in admin to admin dashboard", async ({ page }) => {
  const context = await initPomContext({ page });
  await doLoginKnownAdmin(context);
  const rootUrl = context.website.urlOf("/");
  const expectedUrl = context.website.urlOf(
    RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE,
  );
  await page.goto(rootUrl);
  await expect(page).toHaveURL(expectedUrl);
});
