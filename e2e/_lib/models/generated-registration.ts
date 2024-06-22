import { z } from "zod";
import { GeneratedUserSchema } from "./generated-user";
import { GeneratedDogSchema } from "./generated-dog";

export const GeneratedRegistrationSchema = z.object({
  user: GeneratedUserSchema,
  dog: GeneratedDogSchema,
});

export type GeneratedRegistration = z.infer<typeof GeneratedRegistrationSchema>;
