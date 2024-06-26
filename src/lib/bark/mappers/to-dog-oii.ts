import { z } from "zod";
import { BarkContext } from "../bark-context";

const ResultSchema = z.object({
  dogName: z.string(),
});

type ResultType = z.infer<typeof ResultSchema>;

export async function toDogOii(
  context: BarkContext,
  dogEncryptedOii: string,
): Promise<ResultType> {
  const { oiiEncryptionService } = context;
  const jsonEncoded =
    await oiiEncryptionService.getDecryptedData(dogEncryptedOii);
  return ResultSchema.parse(JSON.parse(jsonEncoded));
}
