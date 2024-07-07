import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator } from "@playwright/test";

export class UserEditDogPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.USER_EDIT_DOG_REGEX;
  }

  dogNameField(): Locator {
    return this.page().getByLabel("Dog Name");
  }

  dogBreedField(): Locator {
    return this.page()
      .getByText("Dog Breed")
      .locator("..")
      .getByLabel("", { exact: true });
  }

  dogBirthdayField(): Locator {
    return this.page().locator('input[name="dogBirthday"]');
  }

  dogWeightField(): Locator {
    return this.page().getByLabel("Dog Weight");
  }

  dogGenderOption_MALE(): Locator {
    return this.page()
      .getByText("Dog Gender", { exact: true })
      .locator("..")
      .getByLabel("Male", { exact: true });
  }

  dogBloodTypeOption_UNKNOWN(): Locator {
    return this.page()
      .getByText("Dog Blood Type")
      .locator("..")
      .getByLabel("I don't know");
  }

  dogEverReceivedTransfusionOption_NO(): Locator {
    return this.page()
      .getByText("Ever Received Blood Transfusion", { exact: true })
      .locator("..")
      .getByLabel("No", { exact: true });
  }

  dogEverPregnantOption_NO(): Locator {
    return this.page()
      .getByText("Ever Pregnant", { exact: true })
      .locator("..")
      .getByLabel("No", { exact: true });
  }

  dogPreferredVetOption_1(): Locator {
    return this.page()
      .getByText("Preferred Vet", { exact: true })
      .locator("..")
      .getByLabel("Vet Clinic 1", { exact: true });
  }

  saveButton(): Locator {
    return this.page().getByRole("button", { name: "Save" });
  }

  cancelButton(): Locator {
    return this.page().getByRole("button", { name: "Cancel" });
  }
}
