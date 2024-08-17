import { z } from "zod";

export const GeneratedUserSchema = z.object({
  userName: z.string(),
  userEmail: z.string(),
  userPhoneNumber: z.string(),
});

export type GeneratedUser = z.infer<typeof GeneratedUserSchema>;
