import { EncryptionProtocol } from "@/lib/encryption/encryption-protocol";
import { Err, Ok, Result } from "@/lib/utilities/result";

/**
 * A standard set of sanity checks for encryption protocols.
 */
export async function standardEncryptionProtocolTests(args: {
  protocol: EncryptionProtocol;
  differentCredentials: EncryptionProtocol;
}): Promise<Result<true, string>> {
  const { protocol, differentCredentials } = args;
  const data = `
  Pale blue horse, wandering on the beach.
  Prancing with the waves, hoofs out of reach.
  `;
  const enc = await protocol.encrypt(data);
  if (enc.error !== undefined) {
    return Err(`Encryption failed: ${enc.error}`);
  }
  if (enc.result.encrypted === data) {
    return Err(`Encrypted output should not match original data`);
  }
  console.log({ encrypted: enc.result.encrypted });
  const dec = await protocol.decrypt(enc.result.encrypted);
  if (dec.error !== undefined) {
    return Err(`Decryption failed: ${dec.error}`);
  }
  if (dec.result.data !== data) {
    return Err(`Decrypted data does not match original data`);
  }
  const isProtocol = protocol.isProtocolFor(enc.result.encrypted);
  if (!isProtocol) {
    return Err(
      `Protocol's isProtocolFor failed to recognise own encrypted string`,
    );
  }

  if (!differentCredentials.isProtocolFor(enc.result.encrypted)) {
    return Err(`Having different credentials should not affect isProtocolFor`);
  }
  const dec2 = await differentCredentials.decrypt(enc.result.encrypted);
  if (dec2.error === undefined) {
    return Err(`Decryption should fail when credentials are different`);
  }
  console.log(dec2.error);
  return Ok(true);
}
