import { z } from "zod";

export const USER_TITLE = {
  MR: "Mr",
  MS: "Ms",
  MRS: "Mrs",
  MDM: "Mdm",
} as const;

export const UserTitleSchema = z.nativeEnum(USER_TITLE);

export type UserTitle = z.infer<typeof UserTitleSchema>;
