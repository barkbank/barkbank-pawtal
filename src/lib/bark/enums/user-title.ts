import { z } from "zod";

export const USER_TITLE = {
  MR: "MR",
  MS: "MS",
  MRS: "MRS",
  MDM: "MDM",
} as const;

export const UserTitleSchema = z.nativeEnum(USER_TITLE);

export type UserTitle = z.infer<typeof UserTitleSchema>;
