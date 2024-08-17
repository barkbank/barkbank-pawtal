import { UserTitleSchema } from "@/lib/bark/enums/user-title";
import { z } from "zod";

export const GeneratedUserSchema = z.object({
  userTitle: UserTitleSchema,
  userName: z.string(),
  userEmail: z.string(),
  userPhoneNumber: z.string(),
});

export type GeneratedUser = z.infer<typeof GeneratedUserSchema>;
