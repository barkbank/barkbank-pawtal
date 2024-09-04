import { UserAccountService } from "@/lib/bark/services/user-account-service";
import { withBarkContext } from "../_context";
import { PawtalService } from "@/lib/bark/services/pawtal-service";
import { UserAccountSpec } from "@/lib/bark/models/user-models";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import {
  parseCommonDate,
  SINGAPORE_TIME_ZONE,
} from "@/lib/utilities/bark-time";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { DOG_ANTIGEN_PRESENCE } from "@/lib/bark/enums/dog-antigen-presence";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";

describe("PawtalService", () => {
  it("can be used to insert and retrieve dog profiles", async () => {
    await withBarkContext(async ({ context }) => {
      const userService = new UserAccountService(context);
      const pawtalService = new PawtalService({ context });
      const { userId } = (
        await userService.create({ spec: _mockUserAccountSpec() })
      ).result!;
      const p1 = _mockDogProfile();
      const { dogId } = (
        await pawtalService.addOwnerDog({ userId, profile: p1 })
      ).result!;
      const p2 = await pawtalService.getOwnerDog({ userId, dogId });
      expect(p2).toMatchObject(p1);
      expect(p1).toMatchObject(p2);
    });
  });
});

function _mockDogProfile(): DogProfile {
  const base: DogProfile = {
    dogName: "dogName",
    dogBreed: "dogBreed",
    dogBirthday: parseCommonDate("8 Mar 2024", SINGAPORE_TIME_ZONE),
    dogGender: DOG_GENDER.MALE,
    dogWeightKg: 22.0,
    dogDea1Point1: DOG_ANTIGEN_PRESENCE.UNKNOWN,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    dogPreferredVetId: "",
  };
  return { ...base };
}

function _mockUserAccountSpec(): UserAccountSpec {
  const base: UserAccountSpec = {
    userName: "Alex Gruul",
    userEmail: "alex.gruul@tbc.user.uk",
    userPhoneNumber: "8988 1919",
    userResidency: USER_RESIDENCY.SINGAPORE,
    userTitle: USER_TITLE.MR,
  };
  return { ...base };
}
