import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { expect, Locator } from "@playwright/test";

export class UserRegistrationPetFormPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.USER_REGISTRATION);
  }

  async checkPageLoaded(): Promise<void> {
    await expect(this.dogEverPregnantOptions()).toBeVisible();
  }

  dogFormHeader(): Locator {
    return this.page()
      .locator("form")
      .getByText("Tell us about your pet", { exact: true });
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

  dogGender_MALE(): Locator {
    return this.page().getByRole("button", { name: "Male", exact: true });
  }

  dogGender_FEMALE(): Locator {
    return this.page().getByRole("button", { name: "Female", exact: true });
  }

  dogWeightField(): Locator {
    return this.page().getByLabel("Dog Weight");
  }

  private dogBloodTypeOptions(): Locator {
    return this.page().getByText("Dog Blood Type").locator("..");
  }

  dogBloodType_UNKNOWN(): Locator {
    return this.dogBloodTypeOptions().getByLabel("I don't know");
  }

  dogBloodType_POSITIVE(): Locator {
    return this.dogBloodTypeOptions().getByLabel("D.E.A 1.1 Positive");
  }

  dogBloodType_NEGATIVE(): Locator {
    return this.dogBloodTypeOptions().getByLabel("D.E.A 1.1 Negative");
  }

  private dogEverReceivedTransfusionOptions(): Locator {
    return this.page()
      .getByText("Has your dog ever received a blood transfusion?")
      .locator("..");
  }

  dogEverReceivedTransfusion_UNKNOWN(): Locator {
    return this.dogEverReceivedTransfusionOptions().getByRole("button", {
      name: "I don't know",
      exact: true,
    });
  }

  dogEverReceivedTransfusion_YES(): Locator {
    return this.dogEverReceivedTransfusionOptions().getByRole("button", {
      name: "Yes",
      exact: true,
    });
  }

  dogEverReceivedTransfusion_NO(): Locator {
    return this.dogEverReceivedTransfusionOptions().getByRole("button", {
      name: "No",
      exact: true,
    });
  }

  private dogEverPregnantOptions(): Locator {
    return this.page()
      .getByText("Has your dog ever been pregnant?")
      .locator("..");
  }

  dogEverPregnant_UNKNOWN(): Locator {
    return this.dogEverPregnantOptions().getByRole("button", {
      name: "I don't know",
      exact: true,
    });
  }

  dogEverPregnant_YES(): Locator {
    return this.dogEverPregnantOptions().getByRole("button", {
      name: "Yes",
      exact: true,
    });
  }

  dogEverPregnant_NO(): Locator {
    return this.dogEverPregnantOptions().getByRole("button", {
      name: "No",
      exact: true,
    });
  }

  dogPreferredVet_None(): Locator {
    return this.page().getByLabel("None");
  }

  dogPreferredVet_VetClinic1(): Locator {
    return this.page().getByLabel("Vet Clinic 1");
  }

  nextButton(): Locator {
    return this.page().getByRole("button", { name: "Next" });
  }

  cancelButton(): Locator {
    return this.page().getByRole("button", { name: "Cancel" });
  }
}
