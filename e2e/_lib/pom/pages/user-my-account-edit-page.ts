import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { expect, Locator } from "@playwright/test";
import { USER_TITLE, UserTitle } from "@/lib/bark/enums/user-title";
import { capitalize } from "lodash";

export class UserMyAccountEditPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.USER_MY_ACCOUNT_EDIT);
  }

  async checkPageLoaded(): Promise<void> {
    await expect(this.userTitleSelection()).toBeVisible();
  }

  cancelButton(): Locator {
    return this.page().getByText("Cancel", { exact: true });
  }

  saveButton(): Locator {
    return this.page().getByText("Save", { exact: true });
  }

  userTitleSelection(): Locator {
    return this.page()
      .getByText("My Title")
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

  userNameField(): Locator {
    return this.page().getByLabel("My Name");
  }

  userPhoneNumberField(): Locator {
    return this.page().getByLabel("My Phone Number");
  }

  userResidencyOption_SG(): Locator {
    return this.page().getByText("Yes", { exact: true });
  }

  userResidencyOption_OTHERS(): Locator {
    return this.page().getByText("No", { exact: true });
  }
}
