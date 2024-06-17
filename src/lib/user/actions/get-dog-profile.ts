import { dbResultQuery } from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { DogProfile, DogProfileSchema } from "@/lib/bark/models/dog-profile";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { EncryptedDogProfileSchema } from "@/lib/bark/models/encrypted-dog-profile";
import { z } from "zod";

export async function getDogProfile(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    DogProfile,
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
    | typeof CODE.DB_QUERY_FAILURE
  >
> {
  const { dbPool, userId, dogMapper } = actor.getParams();
  const sql = `
  SELECT
    tDog.user_id as "dogOwnerId",
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tDog.dog_breed as "dogBreed",
    tDog.dog_birthday as "dogBirthday",
    tDog.dog_gender as "dogGender",
    tLatest.latest_dog_weight_kg as "dogWeightKg",
    tDog.dog_ever_pregnant as "dogEverPregnant",
    tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    CASE
      WHEN tLatest.latest_dog_dea1_point1 = 'POSITIVE' THEN 'POSITIVE'::t_dog_antigen_presence
      WHEN tLatest.latest_dog_dea1_point1 = 'NEGATIVE' THEN 'NEGATIVE'::t_dog_antigen_presence
      ELSE 'UNKNOWN'::t_dog_antigen_presence
    END as "dogDea1Point1",
    COALESCE(tPref.vet_id::text, '') as "dogPreferredVetId"
  FROM dogs as tDog
  LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
  LEFT JOIN (
    SELECT dog_id, vet_id
    FROM dog_vet_preferences
    WHERE dog_id = $1
  ) as tPref on tDog.dog_id = tPref.dog_id
  WHERE tDog.dog_id = $1
  `;
  const RowSchema = EncryptedDogProfileSchema.extend({
    dogOwnerId: z.string(),
  });
  type Row = z.infer<typeof RowSchema>;
  const { result: res, error } = await dbResultQuery<Row>(dbPool, sql, [dogId]);
  if (error !== undefined) {
    return Err(error);
  }
  if (res.rows.length === 0) {
    return Err(CODE.ERROR_DOG_NOT_FOUND);
  }
  const { dogOwnerId, dogEncryptedOii, ...otherFields } = RowSchema.parse(res.rows[0]);
  if (dogOwnerId !== userId) {
    return Err(CODE.ERROR_WRONG_OWNER);
  }
  const { dogName } = await dogMapper.mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  const profile: DogProfile = { dogName, ...otherFields };
  return Ok(DogProfileSchema.parse(profile));
}
