import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { Locator, expect } from "@playwright/test";

export class UserAddDogPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.USER_ADD_DOG);
  }

  async checkPageLoaded() {
    await expect(this.dogBloodTypeOption_POSITIVE()).toBeVisible();
    await expect(this.dogBloodTypeOption_NEGATIVE()).toBeVisible();
    await expect(this.dogBloodTypeOption_UNKNOWN()).toBeVisible();
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

  dogGenderOption_FEMALE(): Locator {
    return this.page()
      .getByText("Dog Gender", { exact: true })
      .locator("..")
      .getByLabel("Female", { exact: true });
  }

  dogBloodTypeOption_POSITIVE(): Locator {
    return this.page()
      .getByText("Dog Blood Type")
      .locator("..")
      .getByLabel("DEA 1 Positive");
  }

  dogBloodTypeOption_NEGATIVE(): Locator {
    return this.page()
      .getByText("Dog Blood Type")
      .locator("..")
      .getByLabel("DEA 1 Negative");
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
