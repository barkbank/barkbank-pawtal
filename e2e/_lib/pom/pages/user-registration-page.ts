import { RoutePath } from "@/lib/route-path";
import { PomPage } from "../core/pom-page";
import { Locator } from "@playwright/test";

export class UserRegistrationPage extends PomPage {
  url(): string {
    return this.website().urlOf(RoutePath.USER_REGISTRATION);
  }

  dogNameField(): Locator {
    return this.page().getByLabel("What's your dog's name?");
  }

  dogBreedField(): Locator {
    return this.page().getByLabel("What's your dog's breed?");
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
    return this.page().getByLabel("What's your dog's weight? (KG)");
  }

  private dogBloodTypeOptions(): Locator {
    return this.page().getByText("Do you know it's blood type?").locator("..");
  }

  dogBloodType_UNKNOWN(): Locator {
    return this.dogBloodTypeOptions().getByLabel("I don't know");
  }

  dogBloodType_POSITIVE(): Locator {
    return this.dogBloodTypeOptions().getByLabel("D.E.A 1.1 positive");
  }

  dogBloodType_NEGATIVE(): Locator {
    return this.dogBloodTypeOptions().getByLabel("D.E.A 1.1 negative");
  }

  private dogEverReceivedTransfusionOptions(): Locator {
    return this.page().getByText("Has it received blood").locator("..");
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
    return this.page().getByText("Has your dog been pregnant").locator("..");
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

  dogPreferredVet_VetClinic1(): Locator {
    return this.page().getByLabel("Vet Clinic 1");
  }

  nextButton(): Locator {
    return this.page().getByRole("button", { name: "Next" });
  }

  cancelButton(): Locator {
    return this.page().getByRole("button", { name: "Cancel" });
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
    return this.page().getByLabel("How would you like to be");
  }

  userPhoneNumberField(): Locator {
    return this.page().getByLabel("What number can we reach you");
  }

  userEmailField(): Locator {
    return this.page().getByLabel("Please provide a login email");
  }

  sendOtpButton(): Locator {
    return this.page().getByRole("button", { name: "Send me an OTP" });
  }

  disclaimerCheckbox(): Locator {
    return this.page().getByLabel("Disclaimer");
  }

  otpField(): Locator {
    return this.page().getByLabel("Enter OTP");
  }

  submitButton(): Locator {
    return this.page().getByRole("button", { name: "Submit" });
  }

  backButton(): Locator {
    return this.page().getByRole("button", { name: "Back" });
  }

  accountCreatedMessage(): Locator {
    return this.page().getByText("your account has been created");
  }

  enterDashboardButton(): Locator {
    return this.page().getByRole("button", { name: "Enter My Dashboard" });
  }
}
