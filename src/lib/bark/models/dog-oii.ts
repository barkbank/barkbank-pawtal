import { z } from "zod";

// TODO: Move into dog-profile-models
export const DogOiiSchema = z.object({
  dogName: z.string(),
});

export type DogOii = z.infer<typeof DogOiiSchema>;
