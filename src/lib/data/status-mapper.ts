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
} from "./db-enums";

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

export function mapStatusSetToHighlightedStatus(
  statusSet: StatusSet,
): HighlightedStatus {
  const {
    serviceStatus,
    profileStatus,
    medicalStatus,
    participationStatus,
    numPendingReports,
  } = statusSet;
  if (serviceStatus === SERVICE_STATUS.UNAVAILABLE) {
    return serviceStatus;
  }
  if (numPendingReports > 0) {
    return SCHEDULING_STATUS.PENDING_REPORT;
  }
  if (participationStatus === PARTICIPATION_STATUS.OPTED_OUT) {
    return participationStatus;
  }
  if (participationStatus === PARTICIPATION_STATUS.PAUSED) {
    return participationStatus;
  }
  if (medicalStatus === MEDICAL_STATUS.PERMANENTLY_INELIGIBLE) {
    return medicalStatus;
  }
  if (profileStatus === PROFILE_STATUS.INCOMPLETE) {
    return profileStatus;
  }
  if (medicalStatus === MEDICAL_STATUS.TEMPORARILY_INELIGIBLE) {
    return medicalStatus;
  }
  if (medicalStatus === MEDICAL_STATUS.ELIGIBLE) {
    return medicalStatus;
  }
  return MEDICAL_STATUS.UNKNOWN;
}
