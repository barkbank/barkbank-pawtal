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
