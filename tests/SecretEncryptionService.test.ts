import { SecretEncryptionService } from "@/lib/services/encryption";
import { guaranteed } from "@/lib/stringutils";

describe("SecretEncryptionService", () => {
  it("should decrypt encrypted data back to original data", async () => {
    const s1 = new SecretEncryptionService(secret(1));
    const originalData = `
      Hey, froggy friend!
      You're my constant companion in this pond of thoughts.
      One day, ribbit, I'll leap to fulfill that promise!
    `;
    const { result: encResult } = await s1.encrypt(originalData);
    const encryptedData = guaranteed(encResult?.encryptedData);
    const { result: decResult } = await s1.decrypt(encryptedData);
    const decryptedData = guaranteed(decResult?.data);
    expect(decryptedData).toEqual(originalData);
    expect(encryptedData).not.toEqual(originalData);
  });
  it("should fail to decrypt if the secret is wrong", async () => {
    // Given a message encrypted using secret(1)
    const s1 = new SecretEncryptionService(secret(1));
    const msg = "Top Secret";
    const { result } = await s1.encrypt(msg);
    if (!result) fail("This is not expected");

    // When decryption is attempted using secret(2)
    const s2 = new SecretEncryptionService(secret(2));
    const { error } = await s2.decrypt(result.encryptedData);

    // Then the signature verification step should fail.
    expect(error).toEqual("Signature verification failed");
  });
});

function secret(idx: number): string {
  return `secret${idx}`;
}
