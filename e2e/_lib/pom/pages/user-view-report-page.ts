import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator } from "@playwright/test";

export class UserViewReportPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.USER_VIEW_REPORT_REGEX;
  }

  dogBreedItem(): Locator {
    return this.reportItem("Dog Breed");
  }

  dogWeightItem(): Locator {
    return this.reportItem("Weight");
  }

  dogGenderItem(): Locator {
    return this.reportItem("Sex");
  }

  dogAgeItem(): Locator {
    return this.reportItem("Age");
  }

  dogBirthdayItem(): Locator {
    return this.reportItem("Birthday");
  }

  dogBloodTypeItem(): Locator {
    return this.reportItem("Blood Type");
  }

  dogEverPregnantItem(): Locator {
    return this.reportItem("Ever Pregnant");
  }

  dogEverReceivedTransfusionItem(): Locator {
    return this.reportItem("Ever Received Blood");
  }

  dogPreferredVetItem(): Locator {
    return this.reportItem("Preferred Vet");
  }

  editButton(): Locator {
    return this.page()
      .locator("div")
      .filter({ hasText: /^Profile$/ })
      .getByRole("link");
  }

  backButton(): Locator {
    return this.page().getByRole("link", { name: "Back" });
  }

  private reportItem(label: string): Locator {
    return this.page()
      .getByRole("heading", { name: `${label}:` })
      .locator("..");
  }
}
