import { z } from "zod";
import { BarkContext } from "../bark-context";

const ResultSchema = z.object({
  userEmail: z.string().email(),
  userName: z.string(),
  userPhoneNumber: z.string(),
});

type ResultType = z.infer<typeof ResultSchema>;

export async function toUserPii(
  context: BarkContext,
  userEncryptedPii: string,
): Promise<ResultType> {
  const { piiEncryptionService } = context;
  const jsonEncoded =
    await piiEncryptionService.getDecryptedData(userEncryptedPii);
  return ResultSchema.parse(JSON.parse(jsonEncoded));
}
