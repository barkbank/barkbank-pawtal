import { RoutePath } from "@/lib/route-path";
import { PomDynamicPage } from "../core/pom-dynamic-page";
import { Locator } from "@playwright/test";

export class UserViewDogPage extends PomDynamicPage {
  urlRegex(): RegExp {
    return RoutePath.USER_VIEW_DOG_REGEX;
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

  editButton(): Locator {
    return this.page().getByRole("link", { name: "Edit" });
  }

  backButton(): Locator {
    return this.page().getByRole("link", { name: "Back" });
  }

  private profileItem(label: string): Locator {
    return this.page()
      .getByRole("heading", { name: `${label}:` })
      .locator("..");
  }
}
