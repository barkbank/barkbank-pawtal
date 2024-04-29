import { test, expect } from "@playwright/test";
import {
  loginTestAdmin,
  loginTestUser,
  loginTestVet,
} from "./_lib/login-test-account";
import { urlOf } from "./_lib/e2e-test-utils";
import { RoutePath } from "@/lib/route-path";

test.describe("root page", () => {
  // WIP: move to root/root-redirects-visitor-to-user-login-page.spec.ts
  test("should route to user login page when not logged-in", async ({
    page,
  }) => {
    await page.goto(urlOf(RoutePath.ROOT));
    await page.waitForURL(urlOf(RoutePath.USER_LOGIN_PAGE));
    await expect(page).toHaveURL(urlOf(RoutePath.USER_LOGIN_PAGE));
  });
  // WIP: move to root/root-redirects-user-to-my-pets-page.spec.ts
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
  // WIP: move to root/root-redirects-vet-to-vet-dashboard.spec.ts - Yes, this will break in future, but we will update it in that case.
  test("should route to vet logged-in page when vet is logged-in", async ({
    page,
  }) => {
    await loginTestVet({ page });
    await expect(page).toHaveURL(urlOf(RoutePath.VET_DEFAULT_LOGGED_IN_PAGE));
    await page.goto(urlOf(RoutePath.ROOT));
    await expect(page).toHaveURL(urlOf(RoutePath.VET_DEFAULT_LOGGED_IN_PAGE));
  });
  // WIP: move to root/root-redirects-vet-to-admin-dashboard.spec.ts - Yes, this will break in future, but we will update it in that case.
  test("should route to admin logged-in page when admin is logged-in", async ({
    page,
  }) => {
    await loginTestAdmin({ page });
    await expect(page).toHaveURL(urlOf(RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE));
    await page.goto(urlOf(RoutePath.ROOT));
    await expect(page).toHaveURL(urlOf(RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE));
  });
});
