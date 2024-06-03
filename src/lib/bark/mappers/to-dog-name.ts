import { BarkContext } from "../bark-context";
import { toDogOii } from "./to-dog-oii";

export async function toDogName(
  context: BarkContext,
  dogEncryptedOii: string,
): Promise<string> {
  const { dogName } = await toDogOii(context, dogEncryptedOii);
  return dogName;
}
