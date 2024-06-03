import { BarkContext } from "../bark-context";

export async function toDecryptedText(
  context: BarkContext,
  encryptedText: string,
): Promise<string> {
  if (encryptedText === "") {
    return "";
  }
  const { textEncryptionService } = context;
  const decryptedText =
    await textEncryptionService.getDecryptedData(encryptedText);
  return decryptedText;
}
