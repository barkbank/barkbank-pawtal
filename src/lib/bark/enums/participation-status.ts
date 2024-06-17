import { z } from "zod";

export const PARTICIPATION_STATUS = {
  OPTED_OUT: "OPTED_OUT",
  PAUSED: "PAUSED",
  PARTICIPATING: "PARTICIPATING",
} as const;

export const ParticipationStatusSchema = z.nativeEnum(PARTICIPATION_STATUS);

export type ParticipationStatus = z.infer<typeof ParticipationStatusSchema>;
