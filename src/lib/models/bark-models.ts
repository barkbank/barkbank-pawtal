import { ObjectValues } from "../bark-utils";

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
  TEMPORARY_INELIGIBLE: "TEMPORARY_INELIGIBLE",
  PERMANENTLY_INELIGIBLE: "PERMANENTLY_INELIGIBLE",
} as const;

export type ReportedIneligibility = ObjectValues<typeof REPORTED_INELIGIBILITY>;

export const SERVICE_STATUS = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export type ServiceStatus = ObjectValues<typeof SERVICE_STATUS>;

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

export type ParticipatingStatus = ObjectValues<typeof PARTICIPATION_STATUS>;

export const SCHEDULING_STATUS = {
  PENDING_APPOINTMENT: "PENDING_APPOINTMENT",
  PENDING_REPORT: "PENDING_REPORT",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export type SchedulingStatus = ObjectValues<typeof SCHEDULING_STATUS>;
