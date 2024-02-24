import crypto from "crypto";
import { Ok, Result } from "../result";

export interface HashService {
  digest(data: string): Promise<Result<{ hashHex: string }, string>>;
}

export class SecretHashService implements HashService {
  private secret: string;

  public constructor(secret: string) {
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
