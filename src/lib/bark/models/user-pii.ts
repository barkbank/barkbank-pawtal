import { z } from "zod";

// WIP: Add userTitle to schema. It is optional.
export const UserPiiSchema = z.object({
  userEmail: z.string().email(),
  userName: z.string(),
  userPhoneNumber: z.string(),
});

export type UserPii = z.infer<typeof UserPiiSchema>;
