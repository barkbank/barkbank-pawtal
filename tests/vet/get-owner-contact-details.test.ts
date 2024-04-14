import { Pool } from "pg";
import { withDb } from "../_db_helpers";
import {
  getVetActor,
  insertDog,
  insertUser,
  insertVet,
  userPii,
} from "../_fixtures";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { OwnerContactDetails } from "@/lib/vet/vet-models";
import { getOwnerContactDetails } from "@/lib/vet/actions/get-owner-contact-details";

describe("getOwnerContactDetails", () => {
  it("should return a dog's owner contact details", async () => {
    await withDb(async (dbPool) => {
      const { vetId } = await insertVet(1, dbPool);
      const { dogId, ownerContactDetails } = await insertOwner(1, dbPool, {
        preferredVetId: vetId,
      });
      const actor = getVetActor(vetId, dbPool);
      const { result, error } = await getOwnerContactDetails(actor, dogId);
      expect(error).toBeUndefined();
      expect(result).toEqual(ownerContactDetails);
    });
  });
  it("should return ERROR_UNAUTHORIZED when vet is not a preferred vet", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { vetId } = await insertVet(1, dbPool);
      const { vetId: otherVetId } = await insertVet(2, dbPool);
      const { dogId } = await insertOwner(1, dbPool, {
        preferredVetId: otherVetId,
      });

      // WHEN
      const actor = getVetActor(vetId, dbPool);
      const { result, error } = await getOwnerContactDetails(actor, dogId);

      // THEN
      expect(error).toEqual("ERROR_UNAUTHORIZED");
      expect(result).toBeUndefined();
    });
  });
  it("should return ERROR_UNAUTHORIZED when vet is a preferred vet of the owner BUT for another dog", async () => {
    await withDb(async (dbPool) => {
      // GIVEN vets v1 and v2
      const v1 = await insertVet(1, dbPool);
      const v2 = await insertVet(2, dbPool);

      // AND user with two dogs d1 and d2
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const d2 = await insertDog(2, u1.userId, dbPool);

      // AND preferred vet for d1 is v1
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);

      // AND preferred vet for d2 is v2
      await dbInsertDogVetPreference(dbPool, d2.dogId, v2.vetId);

      // WHEN v1 requests for owner details of d2.
      const actor = getVetActor(v1.vetId, dbPool);
      const { result, error } = await getOwnerContactDetails(actor, d2.dogId);

      // THEN
      expect(error).toEqual("ERROR_UNAUTHORIZED");
      expect(result).toBeUndefined();
    });
  });
  it("should return ERROR_NO_DOG when dogId matches no dog", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { vetId } = await insertVet(1, dbPool);
      const dogId = "99999"; // no such dog

      // WHEN
      const actor = getVetActor(vetId, dbPool);
      const { result, error } = await getOwnerContactDetails(actor, dogId);

      // THEN
      expect(error).toEqual("ERROR_NO_DOG");
      expect(result).toBeUndefined();
    });
  });
});

async function insertOwner(
  idx: number,
  dbPool: Pool,
  args: { preferredVetId: string },
): Promise<{
  userId: string;
  dogId: string;
  ownerContactDetails: OwnerContactDetails;
}> {
  const { userId } = await insertUser(idx, dbPool);
  const { dogId } = await insertDog(idx, userId, dbPool);
  const { preferredVetId } = args;
  await dbInsertDogVetPreference(dbPool, dogId, preferredVetId);
  const { userName, userEmail, userPhoneNumber } = await userPii(idx);
  const ownerContactDetails: OwnerContactDetails = {
    dogId,
    userName,
    userEmail,
    userPhoneNumber,
  };
  return { userId, dogId, ownerContactDetails };
}
