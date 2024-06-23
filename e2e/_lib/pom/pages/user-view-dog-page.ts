import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator } from "@playwright/test";
import { SGT_UI_DATE, formatDateTime } from "@/lib/utilities/bark-time";

export class UserViewDogPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.USER_VIEW_DOG_REGEX;
  }

  dogNameHeader(name: string): Locator {
    return this.page().getByRole("heading", { name, exact: true });
  }

  dogBreedItem(): Locator {
    return this.profileItem("Breed");
  }

  dogWeightItem(): Locator {
    return this.profileItem("Weight");
  }

  dogGenderItem(): Locator {
    return this.profileItem("Sex");
  }

  dogAgeItem(): Locator {
    return this.profileItem("Age");
  }

  dogBirthdayItem(): Locator {
    return this.profileItem("Birthday");
  }

  dogBloodTypeItem(): Locator {
    return this.profileItem("Blood Type");
  }

  dogEverPregnantItem(): Locator {
    return this.profileItem("Ever Pregnant");
  }

  dogEverReceivedTransfusionItem(): Locator {
    return this.profileItem("Ever Received Blood");
  }

  dogPreferredVetItem(): Locator {
    return this.profileItem("Preferred Vet");
  }

  getReportItem(args: { visitTime: Date; vetName: string }): Locator {
    const { visitTime, vetName } = args;
    const visitTimeText = formatDateTime(visitTime, SGT_UI_DATE);
    return this.page().getByRole("link", {
      name: `Date: ${visitTimeText} Clinic: ${vetName}`,
    });
  }

  editButton(): Locator {
    return this.page()
      .locator("div")
      .filter({ hasText: /^Profile$/ })
      .getByRole("link");
  }

  backButton(): Locator {
    return this.page().getByRole("link", { name: "Back to Pets" });
  }

  private profileItem(label: string): Locator {
    return this.page()
      .getByRole("heading", { name: `${label}:` })
      .locator("..");
  }
}
