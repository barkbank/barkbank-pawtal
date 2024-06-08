import { z } from "zod";

export const OwnerContactDetailsSchema = z.object({
  dogId: z.string(),
  userName: z.string(),
  userPhoneNumber: z.string(),

  /**
   * The last time the vet contacted the user.
   */
  vetUserLastContactedTime: z.date().nullable(),
});

export type OwnerContactDetails = z.infer<typeof OwnerContactDetailsSchema>;
