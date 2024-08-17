import { z } from "zod";
import { UserTitleSchema } from "../enums/user-title";

export const OwnerContactDetailsSchema = z.object({
  dogId: z.string(),
  userTitle: UserTitleSchema.optional(),
  userName: z.string(),
  userPhoneNumber: z.string(),

  /**
   * The last time the vet contacted the user.
   */
  vetUserLastContactedTime: z.date().nullable(),
});

export type OwnerContactDetails = z.infer<typeof OwnerContactDetailsSchema>;
