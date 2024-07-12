import { z } from "zod";

const ReEncryptResultSchema = z.object({
  numRecords: z.number().min(0),
  numValues: z.number().min(0),
  numConcurrentMillis: z.number().min(0),
  numActualMillis: z.number().min(0),
});

export type ReEncryptResult = z.infer<typeof ReEncryptResultSchema>;