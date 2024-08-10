import { z } from "zod";

export const UserPiiSchema = z.object({
  userEmail: z.string().email(),
  userTitle: z.string().optional(),
  userName: z.string(),
  userPhoneNumber: z.string(),
});

export type UserPii = z.infer<typeof UserPiiSchema>;
