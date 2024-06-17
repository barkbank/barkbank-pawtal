import { z } from "zod";
import { ObjectValues } from "../utilities/object-values";

export const POS_NEG_NIL = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  NIL: "NIL",
} as const;

export type PosNegNil = ObjectValues<typeof POS_NEG_NIL>;

export const PosNegNilSchema = z.nativeEnum(POS_NEG_NIL);

export const REPORTED_INELIGIBILITY = {
  NIL: "NIL",
  TEMPORARILY_INELIGIBLE: "TEMPORARILY_INELIGIBLE",
  PERMANENTLY_INELIGIBLE: "PERMANENTLY_INELIGIBLE",
} as const;

export type ReportedIneligibility = ObjectValues<typeof REPORTED_INELIGIBILITY>;

export const ReportedIneligibilitySchema = z.nativeEnum(REPORTED_INELIGIBILITY);

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

export const DOG_ANTIGEN_PRESENCE = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  UNKNOWN: "UNKNOWN",
} as const;

export type DogAntigenPresence = ObjectValues<typeof DOG_ANTIGEN_PRESENCE>;
