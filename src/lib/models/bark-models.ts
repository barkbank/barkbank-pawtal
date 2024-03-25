import { ObjectValues } from "../bark-utils";

export const DOG_STATUS = {
  INCOMPLETE: "INCOMPLETE",
  ELIGIBLE: "ELIGIBLE",
  INELIGIBLE: "INELIGIBLE",
  PERMANENTLY_INELIGIBLE: "PERMANENTLY_INELIGIBLE",
} as const;

export type DogStatus = ObjectValues<typeof DOG_STATUS>;
