import { ObjectValues } from "../utilities/object-values";

export const DOG_STATUS = {
  INCOMPLETE: "INCOMPLETE",
  ELIGIBLE: "ELIGIBLE",
  INELIGIBLE: "INELIGIBLE",
  PERMANENTLY_INELIGIBLE: "PERMANENTLY_INELIGIBLE",
} as const;

export type DogStatus = ObjectValues<typeof DOG_STATUS>;

export const CALL_OUTCOME = {
  APPOINTMENT: "APPOINTMENT",
  DECLINED: "DECLINED",
  OPT_OUT: "OPT_OUT",
} as const;

export type CallOutcome = ObjectValues<typeof CALL_OUTCOME>;

export const POS_NEG_NIL = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  NIL: "NIL",
} as const;

export type PosNegNil = ObjectValues<typeof POS_NEG_NIL>;

export const REPORTED_INELIGIBILITY = {
  NIL: "NIL",
  TEMPORARILY_INELIGIBLE: "TEMPORARILY_INELIGIBLE",
  PERMANENTLY_INELIGIBLE: "PERMANENTLY_INELIGIBLE",
} as const;

export type ReportedIneligibility = ObjectValues<typeof REPORTED_INELIGIBILITY>;

export const SERVICE_STATUS = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export type ServiceStatus = ObjectValues<typeof SERVICE_STATUS>;

export const PROFILE_STATUS = {
  COMPLETE: "COMPLETE",
  INCOMPLETE: "INCOMPLETE",
} as const;

export type ProfileStatus = ObjectValues<typeof PROFILE_STATUS>;

export const MEDICAL_STATUS = {
  UNKNOWN: "UNKNOWN",
  PERMANENTLY_INELIGIBLE: "PERMANENTLY_INELIGIBLE",
  TEMPORARILY_INELIGIBLE: "TEMPORARILY_INELIGIBLE",
  ELIGIBLE: "ELIGIBLE",
} as const;

export type MedicalStatus = ObjectValues<typeof MEDICAL_STATUS>;

export const PARTICIPATION_STATUS = {
  OPTED_OUT: "OPTED_OUT",
  PAUSED: "PAUSED",
  PARTICIPATING: "PARTICIPATING",
} as const;

export type ParticipationStatus = ObjectValues<typeof PARTICIPATION_STATUS>;

export const SCHEDULING_STATUS = {
  PENDING_APPOINTMENT: "PENDING_APPOINTMENT",
  PENDING_REPORT: "PENDING_REPORT",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export type SchedulingStatus = ObjectValues<typeof SCHEDULING_STATUS>;

export const USER_RESIDENCY = {
  OTHER: "OTHER",
  SINGAPORE: "SINGAPORE",
} as const;

export type UserResidency = ObjectValues<typeof USER_RESIDENCY>;

export enum YesNoUnknown {
  YES = "YES",
  NO = "NO",
  UNKNOWN = "UNKNOWN",
}

export enum DogGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
}

export enum DogAntigenPresence {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  UNKNOWN = "UNKNOWN",
}
