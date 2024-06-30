import { EncryptionProtocol } from "../encryption/encryption-protocol";

export interface EncryptionService {
  getEncryptedData(data: string): Promise<string>;
  getDecryptedData(encrypted: string): Promise<string>;
}

export class MultiProtocolEncryptionService implements EncryptionService {
  constructor(private protocols: EncryptionProtocol[]) {}

  async getEncryptedData(data: string): Promise<string> {
    if (this.protocols.length === 0) {
      throw new Error("No protocols defined");
    }
    const protocol = this.protocols[0];
    const { result, error } = await protocol.encrypt(data);
    if (error !== undefined) {
      throw new Error(error);
    }
    return result.encrypted;
  }

  async getDecryptedData(encrypted: string): Promise<string> {
    for (const protocol of this.protocols) {
      if (protocol.isProtocolFor(encrypted)) {
        const { result, error } = await protocol.decrypt(encrypted);
        if (error !== undefined) {
          throw new Error(error);
        }
        return result.data;
      }
    }
    throw new Error("No protocol available for the encrypted data");
  }
}
