import { SCHEDULING_STATUS } from "../bark/enums/scheduling-status";
import { PARTICIPATION_STATUS } from "../bark/enums/participation-status";
import { MEDICAL_STATUS } from "../bark/enums/medical-status";
import { PROFILE_STATUS } from "../bark/enums/profile-status";
import { SERVICE_STATUS } from "../bark/enums/service-status";
import { DogStatuses } from "./dog-models";

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
