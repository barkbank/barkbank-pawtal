import crypto from "crypto";
import { Ok, Result } from "../result";

export interface HashService {
  digest(data: string): Promise<Result<{ hashHex: string }, string>>;
  getHashHex(data: string): Promise<string>;
}

abstract class ConvenientHashService {
  abstract digest(data: string): Promise<Result<{ hashHex: string }, string>>;

  public async getHashHex(data: string): Promise<string> {
    const { result, error } = await this.digest(data);
    if (error !== undefined) {
      throw new Error(error);
    }
    const { hashHex } = result;
    return hashHex;
  }
}

export class SecretHashService extends ConvenientHashService {
  private secret: string;

  public constructor(secret: string) {
    super();
    this.secret = secret;
  }

  public async digest(
    data: string,
  ): Promise<Result<{ hashHex: string }, string>> {
    const hmac = crypto.createHmac("sha256", this.secret);
    hmac.update(data);
    const hashHex = hmac.digest("hex").toLowerCase();
    return Ok({ hashHex });
  }
}
