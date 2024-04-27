import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { Locator } from "@playwright/test";

export class UserMyAccountEditPage extends PomPage {
  public url(): string {
    return this.website().urlOf(RoutePath.USER_MY_ACCOUNT_EDIT);
  }

  cancelButton(): Locator {
    return this.page().getByText("Cancel", { exact: true });
  }

  saveButton(): Locator {
    return this.page().getByText("Save", { exact: true });
  }

  userNameField(): Locator {
    return this.page().getByLabel("Name");
  }

  userPhoneNumberField(): Locator {
    return this.page().getByLabel("Phone Number");
  }

  userResidencyOption_SG(): Locator {
    return this.page().getByText("Yes", { exact: true });
  }

  userResidencyOption_OTHERS(): Locator {
    return this.page().getByText("No", { exact: true });
  }
}
