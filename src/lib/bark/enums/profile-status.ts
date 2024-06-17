import { z } from "zod";

export const PROFILE_STATUS = {
  COMPLETE: "COMPLETE",
  INCOMPLETE: "INCOMPLETE",
} as const;

export const ProfileStatusSchema = z.nativeEnum(PROFILE_STATUS);

export type ProfileStatus = z.infer<typeof ProfileStatusSchema>;
