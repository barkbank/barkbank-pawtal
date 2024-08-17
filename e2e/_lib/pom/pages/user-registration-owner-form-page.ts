import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { expect, Locator } from "@playwright/test";
import { USER_TITLE, UserTitle } from "@/lib/bark/enums/user-title";
import { capitalize } from "lodash";

export class UserRegistrationOwnerFormPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.USER_REGISTRATION);
  }

  async checkPageLoaded(): Promise<void> {
    await expect(this.sendOtpButton()).toBeVisible();
  }

  ownerFormHeader(): Locator {
    return this.page()
      .locator("form")
      .getByText("Add your details", { exact: true });
  }

  userResidency_SINGAPORE(): Locator {
    return this.page()
      .getByText("Are you currently based in Singapore")
      .locator("..")
      .getByRole("button", { name: "Yes", exact: true });
  }

  userResidency_OTHER(): Locator {
    return this.page()
      .getByText("Are you currently based in Singapore")
      .locator("..")
      .getByRole("button", { name: "No", exact: true });
  }

  userNameField(): Locator {
    return this.page().getByLabel("How would you like to be addressed?");
  }

  userTitleSelection(): Locator {
    return this.page()
      .getByText("Please also specify a preferred title")
      .locator("..")
      .getByRole("combobox");
  }

  userTitleOption(args: { userTitle: UserTitle }): Locator {
    const { userTitle } = args;
    if (userTitle === USER_TITLE.PREFER_NOT_TO_SAY) {
      return this.page().getByLabel("Prefer not to say", { exact: true });
    }
    const label = capitalize(userTitle);
    return this.page().getByLabel(label, { exact: true });
  }

  userPhoneNumberField(): Locator {
    return this.page().getByLabel("At which phone number can you be reached?");
  }

  userEmailField(): Locator {
    return this.page().getByLabel("Please provide a login email");
  }

  sendOtpButton(): Locator {
    return this.page().getByRole("button", { name: "Send me an OTP" });
  }

  otpField(): Locator {
    return this.page().getByLabel("Enter OTP");
  }

  disclaimerCheckbox(): Locator {
    return this.page().getByLabel("Disclaimer");
  }

  backButton(): Locator {
    return this.page().getByRole("button", { name: "Back" });
  }

  submitButton(): Locator {
    return this.page().getByRole("button", { name: "Submit" });
  }
}
