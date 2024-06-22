import { z } from "zod";

export const KnownUserSchema = z.object({
  userName: z.string(),
  userEmail: z.string(),
  userPhoneNumber: z.string(),
  userResidency: z.string(),
  userDogs: z.array(
    z.object({
      dogName: z.string(),
      dogStatus: z.string(),
      vetName: z.string().optional(),
    }),
  ),
});

export type KnownUser = z.infer<typeof KnownUserSchema>;
