import { dbQuery } from "../../data/db-utils";
import { MyDog, MyDogAppointment } from "../user-models";
import { UserActor } from "../user-actor";
import {
  DogGender,
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
} from "@/lib/data/db-enums";

export async function getMyPets(actor: UserActor): Promise<MyDog[]> {
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
    dogAppointments: MyDogAppointment[];
  };
  const res = await dbQuery<Row>(dbPool, sql, [userId]);
  const futureDogs = res.rows.map(async (row) => {
    const { dogEncryptedOii, ...otherFields } = row;
    const { dogName } = await dogMapper.mapDogSecureOiiToDogOii({
      dogEncryptedOii,
    });
    const myDog: MyDog = {
      dogName,
      ...otherFields,
    };
    return myDog;
  });
  return Promise.all(futureDogs);
}
