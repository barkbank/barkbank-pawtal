import { z } from "zod";

export const BarkFormOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

export type BarkFormOption = z.infer<typeof BarkFormOptionSchema>;
