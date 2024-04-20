import { dbQuery } from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { DogProfile, SecureDogProfile } from "../user-models";
import { Err, Ok, Result } from "@/lib/utilities/result";

type ErrorCode = "ERROR_UNAUTHORIZED";

export async function getDogProfile(
  actor: UserActor,
  dogId: string,
): Promise<Result<DogProfile, ErrorCode>> {
  const { dbPool, userId, dogMapper } = actor.getParams();
  const sql = `
  SELECT
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tDog.dog_breed as "dogBreed",
    tDog.dog_birthday as "dogBirthday",
    tDog.dog_gender as "dogGender",
    tLatest.latest_dog_weight_kg as "dogWeightKg",
    tDog.dog_ever_pregnant as "dogEverPregnant",
    tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    tLatest.latest_dog_dea1_point1 as "dogDea1Point1",
    COALESCE(tPref.vet_id::text, '') as "dogPreferredVetId"
  FROM dogs as tDog
  LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
  LEFT JOIN (
    SELECT dog_id, vet_id
    FROM dog_vet_preferences
    WHERE dog_id = $1
  ) as tPref on tDog.dog_id = tPref.dog_id
  WHERE tDog.dog_id = $1
  AND tDog.user_id = $2
  `;
  const res = await dbQuery<SecureDogProfile>(dbPool, sql, [dogId, userId]);
  if (res.rows.length === 0) {
    return Err("ERROR_UNAUTHORIZED");
  }
  const { dogEncryptedOii, ...otherFields } = res.rows[0];
  const { dogName } = await dogMapper.mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  const profile: DogProfile = { dogName, ...otherFields };
  return Ok(profile);
}
