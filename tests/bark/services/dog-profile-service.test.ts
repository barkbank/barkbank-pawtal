import { BarkContext } from "@/lib/bark/bark-context";
import { withBarkContext } from "../_context";
import { UserAccountSpec } from "@/lib/bark/models/user-models";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { UserAccountService } from "@/lib/bark/services/user-account-service";
import {
  DogProfileSpec,
  DogProfileSpecSchema,
} from "@/lib/bark/models/dog-profile-models";
import { dateAgo } from "../../_time_helpers";
import { DOG_ANTIGEN_PRESENCE } from "@/lib/bark/enums/dog-antigen-presence";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { DogProfileService } from "@/lib/bark/services/dog-profile-service";
import { VetClinicSpec } from "@/lib/bark/models/vet-models";
import { VetAccountService } from "@/lib/bark/services/vet-account-service";

describe("DogProfileService", () => {
  it("can be used to create and retrieve dog profile", async () => {
    await withBarkContext(async ({ context }) => {
      const { userId } = await _createTestUser({ context, idx: 1 });
      const { vetId } = await _createTestVetClinic({ context, idx: 2 });
      const spec = _mockDogProfileSpec({ dogPreferredVetId: vetId });
      const service = new DogProfileService({ context });
      const res1 = await service.addDogProfile({ userId, spec });
      const { dogId } = res1.result!;
      const res2 = await service.getDogProfile({ userId, dogId });
      const retrieved = res2.result!;
      expect(retrieved).toMatchObject(spec);
      expect(spec).toMatchObject(retrieved);
    });
  });
  it("can list dog profiles by user", async () => {
    await withBarkContext(async ({ context }) => {});
  });

  describe("When there is no existing report", () => {
    it("can be used to update dog profile", async () => {
      await withBarkContext(async ({ context }) => {});
    });
    it("cannot be used to update sub profile", async () => {
      await withBarkContext(async ({ context }) => {});
    });
  });

  describe("When there is an existing medical report", () => {
    it("cannot be used to update dog profile", async () => {
      await withBarkContext(async ({ context }) => {});
    });
    it("can be used to update sub profile", async () => {
      await withBarkContext(async ({ context }) => {});
    });
  });
});

function _mockDogProfileSpec(
  overrides?: Partial<DogProfileSpec>,
): DogProfileSpec {
  const base: DogProfileSpec = {
    dogName: "Woofgang",
    dogBirthday: dateAgo({ numYears: 3 }),
    dogBreed: "German Guard Dog",
    dogGender: DOG_GENDER.MALE,
    dogWeightKg: 26.5,
    dogDea1Point1: DOG_ANTIGEN_PRESENCE.UNKNOWN,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    dogPreferredVetId: "",
  };
  const out = { ...base, ...overrides };
  return DogProfileSpecSchema.parse(out);
}

async function _createTestUser(args: {
  context: BarkContext;
  idx: number;
}): Promise<{ userId: string }> {
  const { context, idx } = args;
  const spec: UserAccountSpec = {
    userEmail: `user${idx}@testuser.com`,
    userTitle: USER_TITLE.MR,
    userName: `Wax ${idx}`,
    userPhoneNumber: `3300 100 ${idx}`,
    userResidency: USER_RESIDENCY.SINGAPORE,
  };
  const service = new UserAccountService(context);
  const { result, error } = await service.create({ spec });
  if (error !== undefined) {
    throw new Error("Failed to create test user");
  }
  const { userId } = result;
  return { userId };
}

async function _createTestVetClinic(args: {
  context: BarkContext;
  idx: number;
}): Promise<{ vetId: string }> {
  const { context, idx } = args;
  const spec: VetClinicSpec = {
    vetName: `Vet ${idx}`,
    vetEmail: `admin@vet${idx}.com`,
    vetPhoneNumber: `1800 123 ${100 + idx}`,
    vetAddress: `${1000 + idx} Longest Street, Vetri, SG 169819`,
  };
  const service = new VetAccountService({ context });
  const res = await service.createVetClinic({ spec });
  if (res.error !== undefined) {
    throw new Error("Failed to create clinic");
  }
  const { vetId } = res.result.clinic;
  return { vetId };
}
