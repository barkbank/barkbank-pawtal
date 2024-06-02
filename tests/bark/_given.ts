import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { getDogMapper, insertDog, insertUser, insertVet } from "../_fixtures";
import { BarkTestContext } from "./_context";
import { YES_NO_UNKNOWN } from "@/lib/data/db-enums";
import { DOG_GENDER, DogGender } from "@/lib/bark/models/dog-gender";
import { dbQuery } from "@/lib/data/db-utils";
import { BarkContext } from "@/lib/bark/bark-context";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";

export async function givenUser(
  context: BarkTestContext,
  options?: { userIdx?: number },
): Promise<{ userId: string }> {
  const { dbPool } = context;
  const args = options ?? {};
  const { userIdx } = args;
  const idx = userIdx ?? 1;
  const { userId } = await insertUser(idx, dbPool);
  return { userId };
}

export async function givenDog(
  context: BarkTestContext,
  options?: { dogIdx?: number; userId?: string; preferredVetId?: string },
): Promise<{
  dogId: string;
  ownerUserId: string;
  dogName: string;
  dogBreed: string;
  dogGender: DogGender;
}> {
  const { dbPool } = context;
  const args = options ?? {};
  const { dogIdx, preferredVetId } = args;
  const idx = dogIdx ?? 1;
  const ownerUserId = await (async () => {
    if (args.userId !== undefined) {
      return args.userId;
    }
    const res = await givenUser(context, { userIdx: idx });
    return res.userId;
  })();
  const { dogId } = await insertDog(idx, ownerUserId, dbPool, {
    dogGender: DOG_GENDER.MALE,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
  });
  if (preferredVetId !== undefined) {
    await dbInsertDogVetPreference(dbPool, dogId, preferredVetId);
  }
  const dogSql = `
  SELECT
    dog_encrypted_oii as "dogEncryptedOii",
    dog_breed as "dogBreed",
    dog_gender as "dogGender"
  FROM dogs
  WHERE dog_id = $1
  `;
  const { dogEncryptedOii, dogBreed, dogGender } = (
    await dbQuery<{
      dogEncryptedOii: string;
      dogBreed: string;
      dogGender: DogGender;
    }>(dbPool, dogSql, [dogId])
  ).rows[0];
  const { dogName } = await getDogMapper().mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  return { dogId, dogName, dogBreed, dogGender, ownerUserId };
}

export async function givenVet(
  context: BarkTestContext,
  options?: { vetIdx?: number },
): Promise<{ vetId: string }> {
  const { dbPool } = context;
  const { vetIdx } = options ?? {};
  const { vetId } = await insertVet(vetIdx ?? 1, dbPool);
  return { vetId };
}

export async function givenAppointment(
  context: BarkContext,
  options?: { idx?: number; existingVetId?: string },
): Promise<{
  appointmentId: string;
  dogId: string;
  vetId: string;
  dogName: string;
  dogBreed: string;
  dogGender: DogGender;
}> {
  const { idx, existingVetId } = options ?? {};
  const vetId =
    existingVetId ?? (await givenVet(context, { vetIdx: idx })).vetId;
  const { dogId, dogName, dogBreed, dogGender } = await givenDog(context, {
    dogIdx: idx,
    preferredVetId: vetId,
  });
  const a1 = await opRecordAppointmentCallOutcome(context, { dogId, vetId });
  const appointmentId = a1.result!.appointmentId;
  return { appointmentId, dogId, vetId, dogName, dogBreed, dogGender };
}
