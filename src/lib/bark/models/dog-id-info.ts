import { z } from "zod";
import { DogGenderSchema } from "./dog-gender";

// TODO: Add preferredVetName - Useful when presented to Users.

/**
 * Dog Identifiable Information (DII)
 *
 * These are a set of natural values that can be used to identify a dog.
 */
export const DogIdInfoSchema = z.object({
  dogName: z.string(),
  dogGender: DogGenderSchema,
  dogBreed: z.string(),
  ownerName: z.string(),
});

export type DogIdInfo = z.infer<typeof DogIdInfoSchema>;
