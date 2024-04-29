import { dbQuery } from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { DogProfile } from "../user-models";
import { Err, Ok, Result } from "@/lib/utilities/result";
import {
  DogAntigenPresence,
  DogGender,
  YesNoUnknown,
} from "@/lib/data/db-enums";
import { BARK_CODE } from "@/lib/utilities/bark-code";

export async function getDogProfile(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    DogProfile,
    typeof BARK_CODE.ERROR_DOG_NOT_FOUND | typeof BARK_CODE.ERROR_WRONG_OWNER
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
  type Row = {
    dogOwnerId: string;
    dogEncryptedOii: string;
    dogBreed: string;
    dogBirthday: Date;
    dogGender: DogGender;
    dogWeightKg: number | null;
    dogDea1Point1: DogAntigenPresence;
    dogEverPregnant: YesNoUnknown;
    dogEverReceivedTransfusion: YesNoUnknown;
    dogPreferredVetId: string;
  };
  const res = await dbQuery<Row>(dbPool, sql, [dogId]);
  if (res.rows.length === 0) {
    return Err(BARK_CODE.ERROR_DOG_NOT_FOUND);
  }
  const { dogOwnerId, dogEncryptedOii, ...otherFields } = res.rows[0];
  if (dogOwnerId !== userId) {
    return Err(BARK_CODE.ERROR_WRONG_OWNER);
  }
  const { dogName } = await dogMapper.mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  const profile: DogProfile = { dogName, ...otherFields };
  return Ok(profile);
}
