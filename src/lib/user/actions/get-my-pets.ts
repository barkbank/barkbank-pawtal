import { dbResultQuery } from "../../data/db-utils";
import { MyDog } from "../user-models";
import { DogAppointment } from "@/lib/dog/dog-models";
import { UserActor } from "../user-actor";
import { ParticipationStatus } from "@/lib/bark/enums/participation-status";
import { MedicalStatus } from "@/lib/bark/enums/medical-status";
import { ProfileStatus } from "@/lib/bark/enums/profile-status";
import { ServiceStatus } from "@/lib/bark/enums/service-status";
import { DogGender } from "@/lib/bark/enums/dog-gender";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { DogStatuses } from "@/lib/bark/models/dog-statuses";

export async function getMyPets(
  actor: UserActor,
): Promise<Result<MyDog[], typeof CODE.DB_QUERY_FAILURE>> {
  const { userId, dbPool, dogMapper } = actor.getParams();
  const sql = `
  WITH
  mUserDogs as (
    SELECT
      dog_id,
      dog_encrypted_oii,
      dog_gender
    FROM dogs
    WHERE user_id = $1
  ),
  mAppointmentsPendingReport as (
    SELECT
      tDog.dog_id,
      json_agg(json_build_object(
        'dogId', tCall.dog_id,
        'callId', tCall.call_id,
        'vetId', tVet.vet_id,
        'vetName', tVet.vet_name
      )) as appointments
    FROM mUserDogs as tDog
    LEFT JOIN calls as tCall on tDog.dog_id = tCall.dog_id
    LEFT JOIN vets as tVet on tCall.vet_id = tVet.vet_id
    WHERE tCall.call_outcome = 'APPOINTMENT'
    GROUP BY tDog.dog_id
  )
  SELECT
    tDog.dog_id as "dogId",
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tDog.dog_gender as "dogGender",
    tStatus.service_status as "dogServiceStatus",
    tStatus.profile_status as "dogProfileStatus",
    tStatus.medical_status as "dogMedicalStatus",
    tStatus.participation_status as "dogParticipationStatus",
    COALESCE(tAppointment.appointments, json_build_array()) as "dogAppointments"
  FROM mUserDogs as tDog
  LEFT JOIN dog_statuses as tStatus on tDog.dog_id = tStatus.dog_id
  LEFT JOIN mAppointmentsPendingReport as tAppointment on tDog.dog_id = tAppointment.dog_id
  `;
  type Row = {
    dogId: string;
    dogEncryptedOii: string;
    dogGender: DogGender;
    dogServiceStatus: ServiceStatus;
    dogProfileStatus: ProfileStatus;
    dogMedicalStatus: MedicalStatus;
    dogParticipationStatus: ParticipationStatus;
    dogAppointments: DogAppointment[];
  };
  const { result, error } = await dbResultQuery<Row>(dbPool, sql, [userId]);
  if (error !== undefined) {
    return Err(error);
  }
  const futureDogs = result.rows.map(async (row) => {
    const {
      dogEncryptedOii,
      dogServiceStatus,
      dogProfileStatus,
      dogMedicalStatus,
      dogParticipationStatus,
      dogAppointments,
      ...otherFields
    } = row;
    const { dogName } = await dogMapper.mapDogSecureOiiToDogOii({
      dogEncryptedOii,
    });
    const dogStatuses: DogStatuses = {
      dogServiceStatus,
      dogProfileStatus,
      dogMedicalStatus,
      dogParticipationStatus,
      numPendingReports: dogAppointments.length,
    };
    const myDog: MyDog = {
      dogName,
      dogAppointments,
      dogStatuses,
      ...otherFields,
    };
    return myDog;
  });
  const pets = await Promise.all(futureDogs);
  return Ok(pets);
}
