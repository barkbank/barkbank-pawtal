import { BarkContext } from "../bark-context";

export async function toIneligibilityReason(
  context: BarkContext,
  encryptedIneligibilityReason: string,
): Promise<string> {
  if (encryptedIneligibilityReason === "") {
    return "";
  }
  const { textEncryptionService } = context;
  const ineligibilityReason = await textEncryptionService.getDecryptedData(
    encryptedIneligibilityReason,
  );
  return ineligibilityReason;
}
