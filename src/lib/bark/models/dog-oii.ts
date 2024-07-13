import { z } from "zod";

export const DogOiiSchema = z.object({
  dogName: z.string(),
});

export type DogOii = z.infer<typeof DogOiiSchema>;
