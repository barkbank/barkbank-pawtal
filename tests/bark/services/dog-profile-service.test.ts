import { BarkContext } from "@/lib/bark/bark-context";
import { withBarkContext } from "../_context";
import { UserAccountSpec } from "@/lib/bark/models/user-models";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { UserAccountService } from "@/lib/bark/services/user-account-service";
import {
  DogProfileSpec,
  DogProfileSpecSchema,
  SubProfileSpec,
  SubProfileSpecSchema,
} from "@/lib/bark/models/dog-profile-models";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { DogProfileService } from "@/lib/bark/services/dog-profile-service";
import { VetClinicSpec } from "@/lib/bark/models/vet-models";
import { VetAccountService } from "@/lib/bark/services/vet-account-service";
import { CODE } from "@/lib/utilities/bark-code";
import { dbTransaction } from "@/lib/data/db-utils";
import { Ok } from "@/lib/utilities/result";
import { CallDao } from "@/lib/bark/daos/call-dao";
import { ReportDao } from "@/lib/bark/daos/report-dao";
import {
  EncryptedReportSpec,
  EncryptedReportSpecSchema,
} from "@/lib/bark/models/report-models";
import {
  parseCommonDate,
  SINGAPORE_TIME_ZONE,
} from "@/lib/utilities/bark-time";
import { POS_NEG_NIL } from "@/lib/bark/enums/pos-neg-nil";
import { REPORTED_INELIGIBILITY } from "@/lib/bark/enums/reported-ineligibility";
import { mockDogProfileSpec } from "../../_fixtures";

describe("DogProfileService", () => {
  it("can be used to create and retrieve dog profile", async () => {
    await withBarkContext(async ({ context }) => {
      const { userId } = await _createTestUser({ context, idx: 1 });
      const { vetId } = await _createTestVetClinic({ context, idx: 2 });
      const spec = mockDogProfileSpec({ dogPreferredVetId: vetId });
      const service = new DogProfileService({ context });
      const res1 = await service.addDogProfile({ userId, spec });
      const { dogId } = res1.result!;
      const res2 = await service.getDogProfile({ userId, dogId });
      const retrieved = DogProfileSpecSchema.parse(res2.result);
      expect(retrieved).toMatchObject(spec);
      expect(spec).toMatchObject(retrieved);
    });
  });

  it("can list dog profiles by user", async () => {
    await withBarkContext(async ({ context }) => {
      const { userId } = await _createTestUser({ context, idx: 3 });
      const v1 = await _createTestVetClinic({ context, idx: 1 });
      const v2 = await _createTestVetClinic({ context, idx: 2 });
      const spec1 = mockDogProfileSpec({
        dogName: "Alan",
        dogGender: DOG_GENDER.MALE,
        dogPreferredVetId: v1.vetId,
      });
      const spec2 = mockDogProfileSpec({
        dogName: "Beth",
        dogGender: DOG_GENDER.FEMALE,
        dogPreferredVetId: v2.vetId,
      });

      const service = new DogProfileService({ context });
      await service.addDogProfile({ userId, spec: spec1 });
      await service.addDogProfile({ userId, spec: spec2 });

      const { result, error } = await service.listDogProfiles({ userId });
      expect(error).toBeUndefined();
      const profileMap: Record<string, DogProfileSpec> = {};
      for (const profile of result!) {
        profileMap[profile.dogName] = DogProfileSpecSchema.parse(profile);
      }
      expect(profileMap["Alan"]).toMatchObject(spec1);
      expect(profileMap["Beth"]).toMatchObject(spec2);
    });
  });

  describe("When a dog has no existing report", () => {
    it("can be used to update dog-profiles with no existing reports", async () => {
      await withBarkContext(async ({ context }) => {
        const { userId } = await _createTestUser({ context, idx: 1 });
        const spec1 = mockDogProfileSpec({ dogName: "Eric" });
        const service = new DogProfileService({ context });
        const resAdd = await service.addDogProfile({ userId, spec: spec1 });
        const { dogId } = resAdd.result!;
        const spec2 = mockDogProfileSpec({ dogName: "Erik" });
        const resUpdate = await service.updateDogProfile({
          userId,
          dogId,
          spec: spec2,
        });
        expect(resUpdate.error).toBeUndefined();
        const resGet = await service.getDogProfile({ userId, dogId });
        const retrieved = DogProfileSpecSchema.parse(resGet.result);
        expect(retrieved).toMatchObject(spec2);
        expect(spec2).toMatchObject(retrieved);
      });
    });

    it("does not allow sub-profile updates on dog without an existing report", async () => {
      await withBarkContext(async ({ context }) => {
        const { userId } = await _createTestUser({ context, idx: 1 });
        const spec1 = mockDogProfileSpec({ dogName: "Eric" });
        const service = new DogProfileService({ context });
        const resAdd = await service.addDogProfile({ userId, spec: spec1 });
        const { dogId } = resAdd.result!;
        const spec2 = _mockSubProfileSpec({ dogName: "Erik" });
        const resUpdate = await service.updateSubProfile({
          userId,
          dogId,
          spec: spec2,
        });
        expect(resUpdate.error).toEqual(CODE.ERROR_SHOULD_UPDATE_FULL_PROFILE);
      });
    });
  });

  describe("When there is an existing medical report", () => {
    it("does not allow dog-profile updates on dogs with an existing report", async () => {
      await withBarkContext(async ({ context }) => {
        const { vetId } = await _createTestVetClinic({ context, idx: 1 });
        const { userId } = await _createTestUser({ context, idx: 1 });
        const spec1 = mockDogProfileSpec({
          dogName: "Eric",
          dogPreferredVetId: vetId,
        });
        const service = new DogProfileService({ context });
        const resAdd = await service.addDogProfile({ userId, spec: spec1 });
        const { dogId } = resAdd.result!;
        await _attachReportToDog({ vetId, dogId, context });
        const spec2 = mockDogProfileSpec({ dogName: "Erik" });
        const resUpdate = await service.updateDogProfile({
          userId,
          dogId,
          spec: spec2,
        });
        expect(resUpdate.error).toEqual(CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE);
      });
    });
    it("can be used to update sub-profile of dog with existing medical report", async () => {
      await withBarkContext(async ({ context }) => {
        const { vetId } = await _createTestVetClinic({ context, idx: 1 });
        const { userId } = await _createTestUser({ context, idx: 1 });
        const spec1 = mockDogProfileSpec({
          dogName: "Eric",
          dogPreferredVetId: vetId,
        });
        const service = new DogProfileService({ context });
        const resAdd = await service.addDogProfile({ userId, spec: spec1 });
        const { dogId } = resAdd.result!;
        await _attachReportToDog({ vetId, dogId, context });
        const spec2 = _mockSubProfileSpec({ dogName: "Erik" });
        const resUpdate = await service.updateSubProfile({
          userId,
          dogId,
          spec: spec2,
        });
        expect(resUpdate.error).toBeUndefined();
        const resGet = await service.getDogProfile({ userId, dogId });
        const retrieved = SubProfileSpecSchema.parse(resGet.result);
        expect(retrieved).toMatchObject(spec2);
        expect(spec2).toMatchObject(retrieved);
      });
    });
  });

  it("uses value from reports when it is more recent than value in dogs", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await _createTestVetClinic({ context, idx: 1 });
      const { userId } = await _createTestUser({ context, idx: 1 });
      const spec1 = mockDogProfileSpec({
        dogName: "Eric",
        dogWeightKg: null,
        dogPreferredVetId: vetId,
      });
      const service = new DogProfileService({ context });
      const resAdd = await service.addDogProfile({ userId, spec: spec1 });
      const { dogId } = resAdd.result!;
      await _attachReportToDog({
        vetId,
        dogId,
        context,
        reportOverrides: { dogWeightKg: 1111 },
      });
      const resGet = await service.getDogProfile({ userId, dogId });
      expect(resGet.result?.dogWeightKg).toEqual(1111);
    });
  });
});

async function _attachReportToDog(args: {
  vetId: string;
  dogId: string;
  context: BarkContext;
  reportOverrides?: Partial<EncryptedReportSpec>;
}) {
  const { vetId, dogId, context, reportOverrides } = args;
  const res = await dbTransaction(context.dbPool, async (conn) => {
    const callDao = new CallDao(conn);
    const { callId } = await callDao.insert({
      spec: { dogId, vetId, callOutcome: "REPORTED" },
    });
    const reportDao = new ReportDao(conn);
    const spec = _mockEncryptedReportSpec({
      ...reportOverrides,
      callId,
      dogId,
      vetId,
    });
    const { reportId } = await reportDao.insert({ spec });
    return Ok({ reportId, callId });
  });
  expect(res.error).toBeUndefined();
  const dao = new ReportDao(context.dbPool);
  const { reportCount } = await dao.getReportCountByDog({ dogId });
  expect(reportCount).toEqual(1);
  return res;
}

function _mockEncryptedReportSpec(
  overrides?: Partial<EncryptedReportSpec>,
): EncryptedReportSpec {
  const base: EncryptedReportSpec = {
    callId: "Must Override",
    dogId: "Must Override",
    vetId: "Must Override",
    visitTime: parseCommonDate("8 Mar 2022", SINGAPORE_TIME_ZONE),
    dogWeightKg: 26.5,
    dogBodyConditioningScore: 5,
    dogHeartworm: POS_NEG_NIL.NEGATIVE,
    dogDea1Point1: POS_NEG_NIL.NEGATIVE,
    ineligibilityStatus: REPORTED_INELIGIBILITY.NIL,
    encryptedIneligibilityReason: "",
    ineligibilityExpiryTime: null,
    dogDidDonateBlood: true,
  };
  const out = { ...base, ...overrides };
  return EncryptedReportSpecSchema.parse(out);
}

function _mockSubProfileSpec(
  overrides?: Partial<SubProfileSpec>,
): SubProfileSpec {
  const base: SubProfileSpec = {
    dogName: "Woofgang",
    dogWeightKg: 26.5,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    dogPreferredVetId: "",
  };
  const out = { ...base, ...overrides };
  return SubProfileSpecSchema.parse(out);
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
