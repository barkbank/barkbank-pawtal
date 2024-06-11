import { z } from "zod";
import { CallTaskSchema } from "./call-task";

export const EncryptedCallTaskSchema = CallTaskSchema.omit({
  dogName: true,
  ownerName: true,
}).extend({
  dogEncryptedOii: z.string(),
  userEncryptedPii: z.string(),
});

export type EncryptedCallTask = z.infer<typeof EncryptedCallTaskSchema>;
