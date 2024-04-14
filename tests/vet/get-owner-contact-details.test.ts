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
