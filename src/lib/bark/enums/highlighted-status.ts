import { z } from "zod";
import { MEDICAL_STATUS } from "./medical-status";
import { PARTICIPATION_STATUS } from "./participation-status";
import { PROFILE_STATUS } from "./profile-status";
import { SCHEDULING_STATUS } from "./scheduling-status";
import { SERVICE_STATUS } from "./service-status";

export const HighlightedStatusSchema = z.enum([
  SERVICE_STATUS.UNAVAILABLE,
  SCHEDULING_STATUS.PENDING_REPORT,
  PARTICIPATION_STATUS.OPTED_OUT,
  PARTICIPATION_STATUS.PAUSED,
  MEDICAL_STATUS.PERMANENTLY_INELIGIBLE,
  PROFILE_STATUS.INCOMPLETE,
  MEDICAL_STATUS.TEMPORARILY_INELIGIBLE,
  MEDICAL_STATUS.ELIGIBLE,
  MEDICAL_STATUS.UNKNOWN,
]);

export type HighlightedStatus = z.infer<typeof HighlightedStatusSchema>;
