import { test, expect } from "@playwright/test";
import {
  urlOf,
  loginTestAdmin,
  loginTestUser,
  loginTestVet,
} from "./_ui_test_helpers";
import { RoutePath } from "@/lib/route-path";

test.describe("root page", () => {
  test("should route to user login page when not logged-in", async ({
    page,
  }) => {
    await page.goto(urlOf(RoutePath.ROOT));
    await page.waitForURL(urlOf(RoutePath.USER_LOGIN_PAGE));
    await expect(page).toHaveURL(urlOf(RoutePath.USER_LOGIN_PAGE));
  });
  test("should route to user logged-in page when user is logged-in", async ({
    page,
  }) => {
    await loginTestUser({ page });
    await expect(page).toHaveURL(urlOf(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE));
    await page.goto(urlOf(RoutePath.USER_MY_ACCOUNT_PAGE));
    await page.waitForURL(urlOf(RoutePath.USER_MY_ACCOUNT_PAGE));
    await page.goto(urlOf(RoutePath.ROOT));
    await expect(page).toHaveURL(urlOf(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE));
  });
  test("should route to vet logged-in page when vet is logged-in", async ({
    page,
  }) => {
    await loginTestVet({ page });
    await expect(page).toHaveURL(urlOf(RoutePath.VET_DEFAULT_LOGGED_IN_PAGE));
    await page.goto(urlOf(RoutePath.ROOT));
    await expect(page).toHaveURL(urlOf(RoutePath.VET_DEFAULT_LOGGED_IN_PAGE));
  });
  test("should route to admin logged-in page when admin is logged-in", async ({
    page,
  }) => {
    await loginTestAdmin({ page });
    await expect(page).toHaveURL(urlOf(RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE));
    await page.goto(urlOf(RoutePath.ROOT));
    await expect(page).toHaveURL(urlOf(RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE));
  });
});
