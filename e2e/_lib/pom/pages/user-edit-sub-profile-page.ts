import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator } from "@playwright/test";
import { YES_NO, YesNo } from "@/lib/bark/enums/yes-no";

export class UserEditSubProfilePage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.USER_EDIT_DOG_REGEX;
  }

  /**
   * @returns Any locator that indicates the form for sub-profile was loaded.
   */
  evidenceThisIsTheSubProfileForm(): Locator {
    return this.page().getByText("Note that after the first");
  }

  dogNameField(): Locator {
    return this.page().getByLabel("Name");
  }

  dogWeightField(): Locator {
    return this.page().getByLabel("Weight");
  }

  dogEverReceivedTransfusionOption(val: YesNo): Locator {
    const div = this.page()
      .getByText("Ever Received Blood Transfusion", { exact: true })
      .locator("..");
    if (val === YES_NO.YES) {
      return div.getByLabel("Yes", { exact: true });
    }
    if (val === YES_NO.NO) {
      return div.getByLabel("No", { exact: true });
    }
    throw Error(`Invalid option val=${val}`);
  }

  dogEverPregnantOption(val: YesNo): Locator {
    const div = this.page()
      .getByText("Ever Pregnant", { exact: true })
      .locator("..");
    if (val === YES_NO.YES) {
      return div.getByLabel("Yes", { exact: true });
    }
    if (val === YES_NO.NO) {
      return div.getByLabel("No", { exact: true });
    }
    throw Error(`Invalid option val=${val}`);
  }

  dogPreferredVetOption_1(): Locator {
    return this.page()
      .getByText("Preferred Donation Point", { exact: true })
      .locator("..")
      .getByLabel("Vet Clinic 1", { exact: true });
  }

  dogPreferredVetOption_2(): Locator {
    return this.page()
      .getByText("Preferred Donation Point", { exact: true })
      .locator("..")
      .getByLabel("Vet Clinic 2", { exact: true });
  }

  saveButton(): Locator {
    return this.page().getByRole("button", { name: "Save" });
  }

  cancelButton(): Locator {
    return this.page().getByRole("button", { name: "Cancel" });
  }
}
