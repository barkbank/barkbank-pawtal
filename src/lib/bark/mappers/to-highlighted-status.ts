import { DogStatuses } from "@/lib/dog/dog-models";
import { HighlightedStatus } from "../enums/highlighted-status";
import { MEDICAL_STATUS } from "../enums/medical-status";
import { PARTICIPATION_STATUS } from "../enums/participation-status";
import { PROFILE_STATUS } from "../enums/profile-status";
import { SCHEDULING_STATUS } from "../enums/scheduling-status";
import { SERVICE_STATUS } from "../enums/service-status";

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
