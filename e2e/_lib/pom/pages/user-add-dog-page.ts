import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { Locator } from "@playwright/test";

export class UserAddDogPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.USER_ADD_DOG);
  }

  dogNameField(): Locator {
    return this.page().getByLabel("Name");
  }

  dogBreedField(): Locator {
    return this.page().getByLabel("Breed");
  }

  dogBirthdayField(): Locator {
    return this.page().locator('input[name="dogBirthday"]');
  }

  dogWeightField(): Locator {
    return this.page().getByLabel("Weight");
  }

  dogGenderOption_MALE(): Locator {
    return this.page()
      .getByText("Sex", { exact: true })
      .locator("..")
      .getByLabel("Male", { exact: true });
  }

  dogGenderOption_FEMALE(): Locator {
    return this.page()
      .getByText("Sex", { exact: true })
      .locator("..")
      .getByLabel("Female", { exact: true });
  }

  dogBloodTypeOption_UNKNOWN(): Locator {
    return this.page()
      .getByText("Blood Type")
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
      .getByText("Preferred Donation Point", { exact: true })
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
