import { VetAccountService } from "@/lib/bark/services/vet-account-service";
import { withBarkContext } from "../_context";
import { givenVet } from "../_given";
import { sortBy } from "lodash";
import { BarkContext } from "@/lib/bark/bark-context";
import {
  VetAccountSpec,
  VetClinic,
  VetClinicSpec,
} from "@/lib/bark/models/vet-models";
import { CODE } from "@/lib/utilities/bark-code";

describe("VetAccountService", () => {
  describe("getVetClinics", () => {
    it("returns vet clinics", async () => {
      await withBarkContext(async ({ context }) => {
        const v1 = await givenVet(context, { vetIdx: 11 });
        const v2 = await givenVet(context, { vetIdx: 2 });
        const service = new VetAccountService({ context });
        const { result, error } = await service.getVetClinics();
        expect(error).toBeUndefined();
        const { clinics } = result!;
        expect(clinics.length).toEqual(2);
        const sortedVets = sortBy([v1, v2], (v) => v.vetName);
        expect(clinics[0].vetName).toEqual(sortedVets[0].vetName);
        expect(clinics[1].vetName).toEqual(sortedVets[1].vetName);
      });
    });
  });
  describe("getVetLoginByEmail", () => {
    it("can resolve by vets.vet_email", async () => {
      await withBarkContext(async ({ context }) => {
        const vetEmail = "hello@vet.com";
        const { vetId } = await _insertVet(context, { vetEmail: vetEmail });
        const service = new VetAccountService({ context });
        const res = await service.getVetLoginByEmail({ email: vetEmail });
        expect(res.result!.vetLogin.clinic.vetId).toEqual(vetId);
      });
    });
    it("can resolve by vet_accounts.vet_account_email", async () => {
      await withBarkContext(async ({ context }) => {
        const vetEmail = "hello@vet.com";
        const vetAccountEmail = "manager@vet.com";
        const { vetId } = await _insertVet(context, { vetEmail: vetEmail });
        await _insertVetAccount(context, { vetAccountEmail, vetId });
        const service = new VetAccountService({ context });
        const res = await service.getVetLoginByEmail({
          email: vetAccountEmail,
        });
        expect(res.result!.vetLogin.clinic.vetId).toEqual(vetId);
      });
    });
    it("returns ERROR_ACCOUNT_NOT_FOUND when there is no vet ID", async () => {
      await withBarkContext(async ({ context }) => {
        const email = "hello@vet.com";
        const vetAccountEmail = "manager@vet.com";
        const otherEmail = "other@vet.com";
        const { vetId } = await _insertVet(context, { vetEmail: email });
        await _insertVetAccount(context, { vetAccountEmail, vetId });
        const service = new VetAccountService({ context });
        const res = await service.getVetLoginByEmail({ email: otherEmail });
        expect(res.error).toEqual(CODE.ERROR_ACCOUNT_NOT_FOUND);
      });
    });
    it("returns ERROR_MULTIPLE_VET_IDS when there are multiple vet IDs", async () => {
      await withBarkContext(async ({ context }) => {
        // GIVEN vet1
        const email1 = "hello@vet1.com";
        const { vetId: vetId1 } = await _insertVet(context, {
          vetEmail: email1,
        });

        // AND vet2 with email that has an account at vet1
        const email2 = "hello@vet2.com";
        await _insertVet(context, { vetEmail: email2 });
        await _insertVetAccount(context, {
          vetAccountEmail: email2,
          vetId: vetId1,
        });

        // WHEN retrieving vet ID by email2
        const service = new VetAccountService({ context });
        const res = await service.getVetLoginByEmail({ email: email2 });

        // THEN...
        expect(res.error).toEqual(CODE.ERROR_MULTIPLE_VET_IDS);
      });
    });
    it("can resolve when both vet and vet account have same email", async () => {
      await withBarkContext(async ({ context }) => {
        // GIVEN vet1
        const email = "hello@vet1.com";
        const { vetId } = await _insertVet(context, { vetEmail: email });
        await _insertVetAccount(context, { vetAccountEmail: email, vetId });

        // WHEN
        const service = new VetAccountService({ context });
        const res = await service.getVetLoginByEmail({ email });

        // THEN...
        expect(res.result!.vetLogin.clinic.vetId).toEqual(vetId);
      });
    });
  });
});

async function _insertVet(
  context: BarkContext,
  args: { vetEmail: string },
): Promise<VetClinic> {
  const { vetEmail } = args;
  const vetName = "Vet Clinic";
  const vetPhoneNumber = "61238888";
  const vetAddress = "26 Albert Ave Singpapore 912064";
  const spec: VetClinicSpec = { vetEmail, vetName, vetPhoneNumber, vetAddress };
  const service = new VetAccountService({ context });
  const { result } = await service.createVetClinic({ spec });
  const { clinic } = result!;
  return clinic;
}

async function _insertVetAccount(
  context: BarkContext,
  args: { vetAccountEmail: string; vetId: string },
): Promise<{ vetAccountId: string }> {
  const { vetAccountEmail, vetId } = args;
  const spec: VetAccountSpec = {
    vetId,
    vetAccountEmail,
    vetAccountName: "Mandy",
  };
  const service = new VetAccountService({ context });
  const { result } = await service.addVetAccount({ spec });
  return { vetAccountId: result!.account.vetAccountId };
}
