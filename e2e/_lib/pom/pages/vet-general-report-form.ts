import { POS_NEG_NIL, PosNegNil } from "@/lib/bark/enums/pos-neg-nil";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator, expect } from "@playwright/test";

export abstract class VetGeneralReportForm extends PomDynamicPage {
  async checkPageLoaded(): Promise<void> {
    await expect(this.visitDateField()).toBeVisible();
    await expect(this.ineligibilityReasonTextArea()).toBeVisible();
  }

  visitDateField(): Locator {
    return this.page().getByLabel("Visit Date");
  }

  dogWeightField(): Locator {
    return this.page().getByLabel("Dog's Weight (KG)");
  }

  dogBcsSelector(): Locator {
    return this.page().getByRole("combobox");
  }

  dogBcsOption5(): Locator {
    return this.dogBcsOption(5);
  }

  dogBcsOption8(): Locator {
    return this.dogBcsOption(8);
  }

  dogBcsOption(val: number): Locator {
    return this.page().getByLabel(val.toString(), { exact: true });
  }

  dogHeartwormOption(val: PosNegNil): Locator {
    if (val === POS_NEG_NIL.POSITIVE) {
      return this.dogHeartwormOption_POSITIVE();
    } else if (val === POS_NEG_NIL.NEGATIVE) {
      return this.dogHeartwormOption_NEGATIVE();
    } else {
      return this.dogHeartwormOption_NIL();
    }
  }

  dogHeartwormOption_POSITIVE(): Locator {
    return this.page().getByLabel("Tested positive for heartworm");
  }

  dogHeartwormOption_NEGATIVE(): Locator {
    return this.page().getByLabel("Tested negative for heartworm");
  }

  dogHeartwormOption_NIL(): Locator {
    return this.page()
      .getByText("Heartworm Test Result")
      .locator("..")
      .getByLabel("Did not test");
  }

  dogDea1Point1(val: PosNegNil): Locator {
    if (val === POS_NEG_NIL.POSITIVE) {
      return this.dogDea1_POSITIVE();
    } else if (val === POS_NEG_NIL.NEGATIVE) {
      return this.dogDea1_NEGATIVE();
    } else {
      return this.dogDea1_NIL();
    }
  }

  dogDea1_POSITIVE(): Locator {
    return this.page().getByLabel("DEA 1 Positive");
  }

  dogDea1_NEGATIVE(): Locator {
    return this.page().getByLabel("DEA 1 Negative");
  }

  dogDea1_NIL(): Locator {
    return this.page()
      .getByText("Blood Test Result")
      .locator("..")
      .getByLabel("Did not test");
  }

  dogDidDonateBlood_YES(): Locator {
    return this.page().getByLabel("Yes", { exact: true });
  }

  dogDidDonateBlood_NO(): Locator {
    return this.page().getByLabel("No", { exact: true });
  }

  dogDidDonateBlood(val: boolean): Locator {
    if (val === true) {
      return this.dogDidDonateBlood_YES();
    } else {
      return this.dogDidDonateBlood_NO();
    }
  }

  ineligibilityReasonTextArea(): Locator {
    return this.page().getByLabel("Please indicate if there are reasons");
  }

  dogEligibility_TEMPORARILY_INELIGIBLE(): Locator {
    return this.page().getByLabel("Temporarily Ineligible", { exact: true });
  }

  dogEligibility_PERMANANTLY_INELIGIBLE(): Locator {
    return this.page().getByLabel("Permanantly Ineligible", { exact: true });
  }

  ineligibilityExpiryDateField(): Locator {
    return this.page().getByLabel(
      "For temporary ineligibility, please indicate",
    );
  }
}
