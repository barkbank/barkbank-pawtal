import { z } from "zod";

const ReEncryptTableInfoSchema = z.object({
  table: z.string(),
  numRecords: z.number().min(0),
});

export type ReEncryptTableInfo = z.infer<typeof ReEncryptTableInfoSchema>;

const ReEncryptResultSchema = z.object({
  tables: z.array(ReEncryptTableInfoSchema),
  numMillis: z.number().min(0),
});

export type ReEncryptResult = z.infer<typeof ReEncryptResultSchema>;
