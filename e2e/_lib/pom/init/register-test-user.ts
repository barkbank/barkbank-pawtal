import { RoutePath } from "@/lib/route-path";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { Page, expect } from "@playwright/test";
import { getTestBirthday } from "../../e2e-test-utils";
import { initPomContext } from "./init-pom-context";
import { UserMyPetsPage } from "../pages/user-my-pets-page";
import { PomContext } from "../core/pom-object";

export async function registerTestUser(args: { page: Page }): Promise<{
  context: PomContext;
  guid: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  dogName: string;
  dogBreed: string;
  dogBirthday: string;
  dogWeightKg: string;
  userMyPetsPage: UserMyPetsPage;
}> {
  const guid = generateRandomGUID(8);
  const userName = `Alice (${guid})`;
  const userEmail = `alice.${guid}@user.com`;
  const userPhoneNumber = guid;
  const dogName = `Bob (${guid})`;
  const dogBreed = "REGISTERED DOG";
  const dogBirthday = getTestBirthday(5);
  const dogWeightKg = "31.4";

  const { page } = args;
  const context = await initPomContext({ page });

  await page.goto(context.website.urlOf(RoutePath.USER_REGISTRATION));
  await expect(page).toHaveURL(
    context.website.urlOf(RoutePath.USER_REGISTRATION),
  );

  // Pet Form
  await page.getByLabel("What's your dog's name?").fill(dogName);
  await page.getByLabel("What's your dog's breed?").fill(dogBreed);
  await page.locator('input[name="dogBirthday"]').fill(dogBirthday);
  await page.getByRole("button", { name: "Male", exact: true }).click();
  await page.getByLabel("What's your dog's weight? (KG)").fill(dogWeightKg);
  await page
    .getByText("Do you know it's blood type?I")
    .getByLabel("I don't know")
    .click();
  await page
    .getByText("Has it received blood transfusion before?I don't knowYesNo")
    .locator('[id="\\:R11rrrqkq\\:-form-item"]')
    .getByRole("button", { name: "No", exact: true })
    .click();
  await page
    .getByText("Has your dog been pregnant before?I don't knowYesNo")
    .locator('[id="\\:R15rrrqkq\\:-form-item"]')
    .getByRole("button", { name: "No", exact: true })
    .click();
  await page.getByLabel("Vet Clinic 1").click();
  await page.getByRole("button", { name: "Next" }).click();

  // Human Form
  await page
    .getByText("Are you currently based in Singapore?YesNo")
    .getByRole("button", { name: "Yes" })
    .click();
  await page.getByLabel("How would you like to be").fill(userName);
  await page.getByLabel("What number can we reach you").fill(userPhoneNumber);
  await page.getByLabel("Please provide a login email").fill(userEmail);
  await page.getByLabel("Enter OTP").fill("000000");
  await page.getByLabel("Disclaimer").click();
  await page.getByRole("button", { name: "Submit" }).click();

  // Final
  await page.getByRole("button", { name: "Enter My Dashboard" }).click();
  await expect(page).toHaveURL(
    context.website.urlOf(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE),
  );
  const userMyPetsPage = new UserMyPetsPage(context);
  await userMyPetsPage.checkUrl();
  const result = {
    context,
    guid,
    userName,
    userEmail,
    userPhoneNumber,
    dogName,
    dogBreed,
    dogBirthday,
    dogWeightKg,
    userMyPetsPage,
  };
  console.log(result);
  return result;
}
