import { PbkdfEncryptionProtocol } from "@/lib/encryption/pbkdf-encryption-protocol";
import { standardEncryptionProtocolTests } from "./standard-encryption-protocol-tests";

describe("PBKDF Encryption Protocol", () => {
  it("passes standard encryption protocol tests", async () => {
    const protocol = new PbkdfEncryptionProtocol("test-secret");
    const differentCredentials = new PbkdfEncryptionProtocol("another-secret");
    const { error } = await standardEncryptionProtocolTests({
      protocol,
      differentCredentials,
    });
    expect(error).toBeUndefined();
  });
});
