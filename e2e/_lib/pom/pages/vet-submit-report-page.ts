import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator } from "@playwright/test";

export class VetSubmitReportPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.VET_APPOINTMENTS_SUBMIT_REGEX;
  }

  visitTimeField(): Locator {
    return this.page().getByLabel("Visit Time");
  }

  dogWeightField(): Locator {
    return this.page().getByLabel("Dog's Weight (KG)");
  }

  dogBcsSelector(): Locator {
    return this.page().getByRole("combobox");
  }

  dogBcsOption8(): Locator {
    return this.page().getByLabel("8", { exact: true });
  }

  dogHeartwormOption_POSITIVE(): Locator {
    return this.page().getByLabel("Tested positive for heartworm");
  }

  dogHeartwormOption_NEGATIVE(): Locator {
    return this.page().getByLabel("Tested negative for heartworm");
  }

  dogHeartwormOption_NIL(): Locator {
    return this.page()
      .locator("div")
      .filter({
        hasText:
          /^Tested positive for heartwormTested negative for heartwormDid not test$/,
      })
      .getByLabel("Did not test");
  }

  dogDea1Point1_POSITIVE(): Locator {
    return this.page().getByLabel("DEA 1.1 Positive");
  }

  dogDea1Point1_NEGATIVE(): Locator {
    return this.page().getByLabel("DEA 1.1 Negative");
  }

  dogDidDonateBlood_YES(): Locator {
    return this.page().getByLabel("Yes", { exact: true });
  }

  dogDidDonateBlood_NO(): Locator {
    return this.page().getByLabel("No", { exact: true });
  }

  dogEligibility_ELIGIBLE(): Locator {
    return this.page().getByLabel("Eligible", { exact: true });
  }

  ineligibilityReasonTextArea(): Locator {
    return this.page().getByLabel("Please indicate a reason (if");
  }

  ineligibilityExpiryDateField(): Locator {
    return this.page().getByLabel("Please indicate a date after");
  }

  submitButton(): Locator {
    return this.page().getByRole("button", {
      name: "Submit Report",
      exact: true,
    });
  }

  cancelButton(): Locator {
    return this.page().getByRole("button", {
      name: "Cancel",
      exact: true,
    });
  }
}
