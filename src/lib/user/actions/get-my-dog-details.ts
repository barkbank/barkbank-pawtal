import { dbQuery } from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { MyDogDetails } from "../user-models";

export async function getMyDogDetails(
  actor: UserActor,
  dogId: string,
): Promise<MyDogDetails | null> {
  const { dbPool, userId, dogMapper } = actor.getParams();
  const sql = `
  WITH
  mUserDog as (
    SELECT *
    FROM dogs
    WHERE dog_id = $1
    AND user_id = $2 -- verify ownership
  ),
  mNumPendingReports as (
    SELECT
      tDog.dog_id,
      COUNT(1) as num_pending_reports
    FROM mUserDog as tDog
    LEFT JOIN calls as tCall on (
      tDog.dog_id = tCall.dog_id
      AND tCall.call_outcome = 'APPOINTMENT'
    )
    LEFT JOIN reports as tReport on tCall.call_id = tReport.call_id
    WHERE tReport.report_id IS NOT NULL
    GROUP BY tDog.dog_id
  )

  SELECT
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tDog.dog_breed as "dogBreed",
    tDog.dog_birthday as "dogBirthday",
    tDog.dog_gender as "dogGender",
    tDog.dog_weight_kg as "dogWeightKg",
    tDog.dog_dea1_point1 as "dogDea1Point1",
    tDog.dog_ever_pregnant as "dogEverPregnant",
    tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    json_build_array() as "dogReports", -- WIP: add test case with dogReports

    tStatus.profile_status as "profileStatus",
    tStatus.medical_status as "medicalStatus",
    tStatus.service_status as "serviceStatus",
    tStatus.participation_status as "participationStatus",
    COALESCE(tPending.num_pending_reports, 0)::integer as "numPendingReports"

    FROM mUserDog as tDog
  LEFT JOIN dog_statuses as tStatus on tDog.dog_id = tStatus.dog_id
  LEFT JOIN mNumPendingReports as tPending on tDog.dog_id = tPending.num_pending_reports
  `;
  const res = await dbQuery(dbPool, sql, [dogId, userId]);
  if (res.rows.length === 0) {
    return null;
  }
  const {
    dogEncryptedOii,
    dogBreed,
    dogBirthday,
    dogGender,
    dogWeightKg,
    dogDea1Point1,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogReports,

    profileStatus,
    medicalStatus,
    serviceStatus,
    participationStatus,
    numPendingReports,
  } = res.rows[0];
  const { dogName } = await dogMapper.mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  const details: MyDogDetails = {
    dogId,
    dogName,
    dogBreed,
    dogBirthday,
    dogGender,
    dogWeightKg,
    dogDea1Point1,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogReports,

    profileStatus,
    medicalStatus,
    serviceStatus,
    participationStatus,
    numPendingReports,
  };
  return details;
}
