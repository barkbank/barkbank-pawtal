import crypto from "crypto";
import { Err, Ok, Result } from "../utilities/result";
import { EncryptionProtocol } from "../encryption/encryption-protocol";
import { PbkdfEncryptionProtocol } from "../encryption/pbkdf-encryption-protocol";

export interface EncryptionService {
  encrypt(data: string): Promise<Result<{ encryptedData: string }, string>>;
  decrypt(encryptedData: string): Promise<Result<{ data: string }, string>>;

  getEncryptedData(data: string): Promise<string>;
  getDecryptedData(encryptedData: string): Promise<string>;
}

abstract class ConvenientEncryptionService implements EncryptionService {
  abstract encrypt(
    data: string,
  ): Promise<Result<{ encryptedData: string }, string>>;
  abstract decrypt(
    encryptedData: string,
  ): Promise<Result<{ data: string }, string>>;

  public async getEncryptedData(data: string): Promise<string> {
    const { result, error } = await this.encrypt(data);
    if (error !== undefined) {
      throw new Error(error);
    }
    const { encryptedData } = result;
    return encryptedData;
  }

  public async getDecryptedData(encryptedData: string): Promise<string> {
    const { result, error } = await this.decrypt(encryptedData);
    if (error !== undefined) {
      throw new Error(error);
    }
    const { data } = result;
    return data;
  }
}

export class SecretEncryptionService extends ConvenientEncryptionService {
  private protocol: EncryptionProtocol;

  public constructor(secret: string) {
    super();
    this.protocol = new PbkdfEncryptionProtocol(secret);
  }

  public async encrypt(
    data: string,
  ): Promise<Result<{ encryptedData: string }, string>> {
    const res = await this.protocol.encrypt(data);
    if (res.error !== undefined) {
      return Err(res.error);
    }
    return Ok({ encryptedData: res.result.encrypted });
  }

  public async decrypt(
    encryptedData: string,
  ): Promise<Result<{ data: string }, string>> {
    const res = await this.protocol.decrypt(encryptedData);
    if (res.error !== undefined) {
      return Err(res.error);
    }
    return Ok({ data: res.result.data });
  }
}
