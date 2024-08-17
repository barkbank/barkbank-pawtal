import { z } from "zod";
import { UserTitleSchema } from "../enums/user-title";

export const UserPiiSchema = z.object({
  userEmail: z.string().email(),
  userTitle: UserTitleSchema.optional(),
  userName: z.string(),
  userPhoneNumber: z.string(),
});

export type UserPii = z.infer<typeof UserPiiSchema>;
