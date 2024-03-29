import { Pool } from "pg";
import { DogMapper } from "../data/dog-mapper";
import { dbQuery } from "../data/db-utils";
import { MyDog } from "../models/user-models";

export async function handleUserGetMyPets(args: {
  userId: string;
  dbPool: Pool;
  dogMapper: DogMapper;
}): Promise<MyDog[]> {
  const { userId, dbPool, dogMapper } = args;
  const sql = `
  WITH
  mUserDogs as (
    SELECT
      dog_id,
      dog_encrypted_oii
    FROM dogs
    WHERE user_id = $1
  ),
  mAppointmentsPendingReport as (
    SELECT
      tDog.dog_id,
      json_agg(json_build_object(
        'callId', tCall.call_id,
        'vetId', tVet.vet_id,
        'vetName', tVet.vet_name
      )) as appointments
    FROM mUserDogs as tDog
    LEFT JOIN calls as tCall on tDog.dog_id = tCall.dog_id
    LEFT JOIN reports as tReport on tCall.call_id = tReport.call_id
    LEFT JOIN vets as tVet on tCall.vet_id = tVet.vet_id
    WHERE tCall.call_outcome = 'APPOINTMENT'
    AND tReport.report_id IS NULL
    GROUP BY tDog.dog_id
  )
  SELECT
    tDog.dog_id as "dogId",
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tStatus.profile_status as "dogProfileStatus",
    tStatus.medical_status as "dogMedicalStatus",
    COALESCE(tAppointment.appointments, json_build_array()) as "dogAppointments"
  FROM mUserDogs as tDog
  LEFT JOIN dog_statuses as tStatus on tDog.dog_id = tStatus.dog_id
  LEFT JOIN mAppointmentsPendingReport as tAppointment on tDog.dog_id = tAppointment.dog_id
  `;
  const res = await dbQuery(dbPool, sql, [userId]);
  const dogs = await Promise.all(
    res.rows.map(async (row) => {
      const { dogId, dogProfileStatus, dogMedicalStatus, dogAppointments } =
        row;
      const secureOii = dogMapper.toDogSecureOii(row);
      const { dogName } = await dogMapper.mapDogSecureOiiToDogOii(secureOii);
      const myDog: MyDog = {
        dogId,
        dogName,
        dogProfileStatus,
        dogMedicalStatus,
        dogAppointments,
      };
      return myDog;
    }),
  );
  return dogs;
}
