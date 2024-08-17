import { z } from "zod";

export const USER_TITLE = {
  MR: "MR",
  MS: "MS",
  MRS: "MRS",
  MDM: "MDM",
  PREFER_NOT_TO_SAY: "PREFER_NOT_TO_SAY",
} as const;

export const UserTitleSchema = z.nativeEnum(USER_TITLE);

export type UserTitle = z.infer<typeof UserTitleSchema>;
