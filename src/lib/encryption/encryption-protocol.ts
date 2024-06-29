import { Result } from "../utilities/result";

export interface EncryptionProtocol {
  encrypt(data: string): Promise<Result<{ encrypted: string }, string>>;
  decrypt(encrypted: string): Promise<Result<{ data: string }, string>>;
  isProtocolFor(encrypted: string): boolean;
}
