import { z } from "zod";

export const UserPiiSchema = z.object({
  userEmail: z.string().email(),
  userName: z.string(),
  userPhoneNumber: z.string(),
});

export type UserPii = z.infer<typeof UserPiiSchema>;
