import { BarkContext } from "../bark-context";

export async function toEncryptedText(
  context: BarkContext,
  text: string,
): Promise<string> {
  if (text === "") {
    return "";
  }
  const { textEncryptionService } = context;
  const encryptedText = await textEncryptionService.getDecryptedData(text);
  return encryptedText;
}
