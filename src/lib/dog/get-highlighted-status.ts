import {
  MEDICAL_STATUS,
  MedicalStatus,
  PARTICIPATION_STATUS,
  PROFILE_STATUS,
  ParticipationStatus,
  ProfileStatus,
  SCHEDULING_STATUS,
  SERVICE_STATUS,
  ServiceStatus,
} from "../data/db-enums";
import { DogStatuses } from "./dog-models";

/**
 * @deprecated - use DogStatuses instead.
 */
export type StatusSet = {
  serviceStatus: ServiceStatus;
  profileStatus: ProfileStatus;
  medicalStatus: MedicalStatus;
  participationStatus: ParticipationStatus;
  numPendingReports: number;
};

export type HighlightedStatus =
  | typeof SERVICE_STATUS.UNAVAILABLE
  | typeof SCHEDULING_STATUS.PENDING_REPORT
  | typeof PARTICIPATION_STATUS.OPTED_OUT
  | typeof PARTICIPATION_STATUS.PAUSED
  | typeof MEDICAL_STATUS.PERMANENTLY_INELIGIBLE
  | typeof PROFILE_STATUS.INCOMPLETE
  | typeof MEDICAL_STATUS.TEMPORARILY_INELIGIBLE
  | typeof MEDICAL_STATUS.ELIGIBLE
  | typeof MEDICAL_STATUS.UNKNOWN;

/**
 * https://www.notion.so/Status-Definitions-1863858b32eb4016b73d1ddc6c16d26f?pvs=4#e0ef6804a6704fa19d7966ba2b830a17
 */
export function getHighlightedStatus(
  dogStatuses: DogStatuses,
): HighlightedStatus {
  const {
    dogServiceStatus,
    dogProfileStatus,
    dogMedicalStatus,
    dogParticipationStatus,
    numPendingReports,
  } = dogStatuses;
  if (dogServiceStatus === SERVICE_STATUS.UNAVAILABLE) {
    return dogServiceStatus;
  }
  if (numPendingReports > 0) {
    return SCHEDULING_STATUS.PENDING_REPORT;
  }
  if (dogParticipationStatus === PARTICIPATION_STATUS.OPTED_OUT) {
    return dogParticipationStatus;
  }
  if (dogParticipationStatus === PARTICIPATION_STATUS.PAUSED) {
    return dogParticipationStatus;
  }
  if (dogMedicalStatus === MEDICAL_STATUS.PERMANENTLY_INELIGIBLE) {
    return dogMedicalStatus;
  }
  if (dogProfileStatus === PROFILE_STATUS.INCOMPLETE) {
    return dogProfileStatus;
  }
  if (dogMedicalStatus === MEDICAL_STATUS.TEMPORARILY_INELIGIBLE) {
    return dogMedicalStatus;
  }
  if (dogMedicalStatus === MEDICAL_STATUS.ELIGIBLE) {
    return dogMedicalStatus;
  }
  return MEDICAL_STATUS.UNKNOWN;
}
