import { PbkdfEncryptionProtocol } from "@/lib/encryption/pbkdf-encryption-protocol";
import { standardEncryptionProtocolTests } from "./standard-encryption-protocol-tests";

describe("PBKDF Encryption Protocol", () => {
  it("passes standard encryption protocol tests", async () => {
    const secret = "test-password";
    const protocol = new PbkdfEncryptionProtocol(secret);
    const { error } = await standardEncryptionProtocolTests(protocol);
    expect(error).toBeUndefined();
  });
});
