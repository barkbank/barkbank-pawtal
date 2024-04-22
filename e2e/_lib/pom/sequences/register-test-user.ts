import { RoutePath } from "@/lib/route-path";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { Page, expect } from "@playwright/test";
import { urlOf, getTestBirthday } from "../../e2e-test-utils";

export async function registerTestUser(args: { page: Page }): Promise<{
  guid: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  dogName: string;
  dogBreed: string;
}> {
  const guid = generateRandomGUID(8);
  const userName = `Alice (${guid})`;
  const userEmail = `alice.${guid}@user.com`;
  const userPhoneNumber = guid;
  const dogName = `Bob (${guid})`;
  const dogBreed = "REGISTERED DOG";

  const { page } = args;
  await page.goto(urlOf(RoutePath.USER_REGISTRATION));
  await expect(page).toHaveURL(urlOf(RoutePath.USER_REGISTRATION));

  // Pet Form
  await page.getByLabel("What's your dog's name?").fill(dogName);
  await page.getByLabel("What's your dog's breed?").fill(dogBreed);
  await page.locator('input[name="dogBirthday"]').fill(getTestBirthday(5));
  await page.getByRole("button", { name: "Male", exact: true }).click();
  await page.getByLabel("What's your dog's weight? (KG)").fill("31.4");
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

  await page.getByRole("button", { name: "Enter My Dashboard" }).click();
  await expect(page).toHaveURL(urlOf(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE));
  return { guid, userName, userEmail, userPhoneNumber, dogName, dogBreed };
}
