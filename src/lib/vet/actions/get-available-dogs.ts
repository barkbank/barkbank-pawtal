import { dbQuery } from "@/lib/data/db-utils";
import { VetActor } from "../vet-actor";
import { AvailableDog } from "../vet-models";
import { YesNoUnknown } from "@/lib/bark/enums/yes-no-unknown";
import { DogGender } from "@/lib/bark/models/dog-gender";

// WIP: Delete getAvailableDogs when migrated to call tasks.

/**
 * Get dogs that are available for scheduling.
 *
 * A dog is available when:
 * - the actor is a preferred vet of the dog
 * - AND dog has no pending reports
 * - AND service_status is AVAILABLE
 * - AND profile_status is COMPLETE
 * - AND medical_status is ELIGIBLE
 * - AND participation_status is PARTICPATING
 *
 * @param actor
 * @returns list of available dogs
 */
export async function getAvailableDogs(
  actor: VetActor,
): Promise<AvailableDog[]> {
  const rows = await fetchRows(actor);
  return toAvailableDogs(actor, rows);
}

type Row = {
  dogId: string;
  dogEncryptedOii: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogEverPregnant: YesNoUnknown;
};

async function fetchRows(actor: VetActor): Promise<Row[]> {
  const { vetId, dbPool } = actor.getParams();
  const sql = `
  WITH
  mVetDogs as (
    SELECT dog_id
    FROM dog_vet_preferences
    WHERE vet_id = $1
  ),
  mStatusAvailDogs as (
    SELECT tStatus.dog_id
    FROM mVetDogs as tVet
    LEFT JOIN dog_statuses as tStatus on tVet.dog_id = tStatus.dog_id
    WHERE tStatus.service_status = 'AVAILABLE'
    AND tStatus.profile_status = 'COMPLETE'
    AND tStatus.medical_status = 'ELIGIBLE'
    AND tStatus.participation_status = 'PARTICIPATING'
  ),
  mDogsPendingReports as (
    SELECT dog_id
    FROM calls
    WHERE call_outcome = 'APPOINTMENT'
    GROUP BY dog_id
  )

  SELECT
    tDog.dog_id as "dogId",
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tDog.dog_breed as "dogBreed",
    tDog.dog_birthday as "dogBirthday",
    tDog.dog_gender as "dogGender",
    tDog.dog_weight_kg as "dogWeightKg",
    tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    tDog.dog_ever_pregnant as "dogEverPregnant"
  FROM dogs as tDog
  WHERE tDog.dog_id in (SELECT dog_id FROM mStatusAvailDogs)
  AND tDog.dog_id NOT IN (SELECT dog_id FROM mDogsPendingReports)
  `;
  const res = await dbQuery<Row>(dbPool, sql, [vetId]);
  return res.rows;
}

async function toAvailableDogs(
  actor: VetActor,
  rows: Row[],
): Promise<AvailableDog[]> {
  const { dogMapper } = actor.getParams();
  const futureDogs = rows.map<Promise<AvailableDog>>(async (row) => {
    const { dogEncryptedOii, ...otherFields } = row;
    const { dogName } = await dogMapper.mapDogSecureOiiToDogOii({
      dogEncryptedOii,
    });
    const avail: AvailableDog = { dogName, ...otherFields };
    return avail;
  });
  return Promise.all(futureDogs);
}
