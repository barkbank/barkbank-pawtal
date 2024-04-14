import { dbQuery } from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { MyDogDetails, MyDogReport } from "../user-models";
import {
  DogAntigenPresence,
  DogGender,
  MedicalStatus,
  PARTICIPATION_STATUS,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
  YesNoUnknown,
} from "@/lib/data/db-enums";
import { StatusSet } from "@/lib/data/status-mapper";

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
    WHERE tCall.call_id IS NOT NULL
    AND tReport.report_id IS NULL
    GROUP BY tDog.dog_id
  ),
  mReports as (
    SELECT
      tDog.dog_id,
      json_agg(json_build_object(
        'reportId', tReport.report_id::text,
        'visitTime', tReport.visit_time::text,
        'vetId', tVet.vet_id::text,
        'vetName', tVet.vet_name
      )) as dog_reports
    FROM mUserDog as tDog
    LEFT JOIN reports as tReport on tDog.dog_id = tReport.dog_id
    LEFT JOIN vets as tVet on tReport.vet_id = tVet.vet_id
    WHERE tReport.report_id IS NOT NULL
    GROUP BY tDog.dog_id
  ),
  mPreferredVet as (
    SELECT dog_id, vet_id
    FROM dog_vet_preferences
    WHERE dog_id = $1
    ORDER BY preference_creation_time DESC
    LIMIT 1
  )

  SELECT
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tDog.dog_breed as "dogBreed",
    tDog.dog_birthday as "dogBirthday",
    tDog.dog_gender as "dogGender",
    tLatest.latest_dog_weight_kg as "dogWeightKg",
    tLatest.latest_dog_dea1_point1 as "dogDea1Point1",
    tDog.dog_ever_pregnant as "dogEverPregnant",
    tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    COALESCE(tReport.dog_reports, json_build_array()) as "jsonDogReports",
    tStatus.participation_status as "dogParticipationStatus",
    tStatus.participation_pause_expiry_time as "dogPauseExpiryTime",
    tDog.dog_encrypted_reason as "dogEncryptedReason",
    tPref.vet_id as "dogPreferredVetId",

    -- For StatusSet
    tStatus.profile_status as "profileStatus",
    tStatus.medical_status as "medicalStatus",
    tStatus.service_status as "serviceStatus",
    tStatus.participation_status as "participationStatus",
    COALESCE(tPending.num_pending_reports, 0)::integer as "numPendingReports"

  FROM mUserDog as tDog
  LEFT JOIN dog_statuses as tStatus on tDog.dog_id = tStatus.dog_id
  LEFT JOIN mNumPendingReports as tPending on tDog.dog_id = tPending.num_pending_reports
  LEFT JOIN mReports as tReport on tDog.dog_id = tReport.dog_id
  LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
  LEFT JOIN mPreferredVet as tPref on tDog.dog_id = tPref.dog_id
  `;
  // TODO: if we fetch the reports in a separate query we can retrieve visitTime as a Date.
  type ReportRow = {
    reportId: string;
    visitTime: string;
    vetId: string;
    vetName: string;
  };
  type Row = StatusSet & {
    dogEncryptedOii: string;
    dogBreed: string;
    dogBirthday: Date;
    dogGender: DogGender;
    dogWeightKg: number | null;
    dogDea1Point1: DogAntigenPresence;
    dogEverPregnant: YesNoUnknown;
    dogEverReceivedTransfusion: YesNoUnknown;
    jsonDogReports: ReportRow[];
    dogParticipationStatus: ParticipationStatus;
    dogPauseExpiryTime: Date | null;
    dogEncryptedReason: string;
    dogPreferredVetId: string | null;
  };
  const res = await dbQuery<Row>(dbPool, sql, [dogId, userId]);
  if (res.rows.length === 0) {
    return null;
  }
  const {
    dogEncryptedOii,
    jsonDogReports,
    dogParticipationStatus,
    dogEncryptedReason,
    ...otherFields
  } = res.rows[0];
  const { dogName } = await dogMapper.mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  const dogReports: MyDogReport[] = jsonDogReports.map(
    (raw: {
      reportId: string;
      visitTime: string;
      vetId: string;
      vetName: string;
    }) => {
      const report: MyDogReport = {
        reportId: raw.reportId,
        visitTime: new Date(raw.visitTime),
        vetId: raw.vetId,
        vetName: raw.vetName,
      };
      return report;
    },
  );
  const dogNonParticipationReason = await getDogNonParticipationReason(actor, {
    dogParticipationStatus,
    dogEncryptedReason,
  });
  const details: MyDogDetails = {
    dogId,
    dogName,
    dogReports,
    dogParticipationStatus,
    dogNonParticipationReason,
    ...otherFields,
  };
  return details;
}

async function getDogNonParticipationReason(
  actor: UserActor,
  args: {
    dogParticipationStatus: ParticipationStatus;
    dogEncryptedReason: string;
  },
): Promise<string> {
  const { dogParticipationStatus, dogEncryptedReason } = args;
  if (dogParticipationStatus === PARTICIPATION_STATUS.PARTICIPATING) {
    return "";
  }
  if (dogEncryptedReason === "") {
    return "";
  }
  const { textEncryptionService } = actor.getParams();
  return textEncryptionService.getDecryptedData(dogEncryptedReason);
}
