import crypto from "crypto";
import { Err, Ok, Result } from "../utilities/result";
import { EncryptionProtocol } from "./encryption-protocol";

type Pbkdf2Params = {
  saltLength: number;
  numIterations: number;
  keyLength: number;
  digest: string;
};

type CipherParams = {
  algorithm: string;
  ivLength: number;
};

type PackablePayload = {
  pbkdf2Params: Pbkdf2Params;
  cipherParams: CipherParams;
  salt: Buffer;
  iv: Buffer;
  ciphertext: string;
};

const _SIG_ENCODING = "base64";
const _CIPHERTEXT_ENCODING = "base64";
const _BUFFER_ENCODING = "base64";

export class PbkdfEncryptionProtocol implements EncryptionProtocol {
  private params: {
    pbkdf2Params: Pbkdf2Params;
    cipherParams: CipherParams;
  };

  constructor(private secret: string) {
    this.params = {
      pbkdf2Params: {
        saltLength: 16,
        numIterations: 10000,
        keyLength: 32,
        digest: "sha256",
      },
      cipherParams: {
        algorithm: "aes-256-cbc",
        ivLength: 16,
      },
    };
  }

  name(): string {
    return "PbkdfEncryptionProtocol";
  }

  async encrypt(data: string): Promise<Result<{ encrypted: string }, string>> {
    // Params
    const { pbkdf2Params, cipherParams } = this.params;

    // Create encryption key
    const salt = crypto.randomBytes(pbkdf2Params.saltLength);
    const key = await this.getEncryptionKey(pbkdf2Params, salt);

    // Create cipher
    const iv = crypto.randomBytes(cipherParams.ivLength);
    const cipher = crypto.createCipheriv(cipherParams.algorithm, key, iv);

    // Encrypt data
    let ciphertext = cipher.update(data, "utf8", _CIPHERTEXT_ENCODING);
    ciphertext += cipher.final(_CIPHERTEXT_ENCODING);

    // Pack payload for signing
    const { payload } = this.packPayload({
      pbkdf2Params,
      cipherParams,
      salt,
      iv,
      ciphertext,
    });

    // Sign payload
    const { sig } = this.signPayload(payload);

    // Return sig and payload
    const encrypted = `${sig}.${payload}`;
    return Ok({ encrypted });
  }

  async decrypt(encrypted: string): Promise<Result<{ data: string }, string>> {
    // Verify sig
    const [sig, payload] = encrypted.split(".");
    const { isValid } = this.verifyPayload(payload, sig);
    if (!isValid) {
      return Err("Signature verification failed");
    }

    // Unpack params and ciphertext
    const unpacked = this.unpackPayload(payload);
    const { pbkdf2Params, cipherParams, salt, iv, ciphertext } = unpacked;

    // Derive decryption key
    const key = await this.getEncryptionKey(pbkdf2Params, salt);

    // Decrypt
    const decipher = crypto.createDecipheriv(cipherParams.algorithm, key, iv);
    let data = decipher.update(ciphertext, _CIPHERTEXT_ENCODING, "utf8");
    data += decipher.final("utf8");
    return Ok({ data });
  }

  /**
   * PbkdfEncryptionProtocol is the first encryption protocol in Pawtal, still
   * supported for backward compatibility with encrypted data in development
   * deployments. All future protocols should return false when provided
   * encrypted data produced by this protocol. Hence, this implementation of
   * isProtocolFor() can be quite simple in what it looks for.
   */
  isProtocolFor(encrypted: string): boolean {
    const parts = encrypted.split(".");
    return parts.length === 2;
  }

  private packPayload(packable: PackablePayload): { payload: string } {
    const { pbkdf2Params, cipherParams, salt, iv, ciphertext } = packable;
    const saltString = salt.toString(_BUFFER_ENCODING);
    const ivString = iv.toString(_BUFFER_ENCODING);
    const payload = Buffer.from(
      JSON.stringify({
        pbkdf2Params,
        cipherParams,
        saltString,
        ivString,
        ciphertext,
      }),
    ).toString(_BUFFER_ENCODING);
    return { payload };
  }

  private unpackPayload(payload: string): PackablePayload {
    const json = Buffer.from(payload, _BUFFER_ENCODING).toString("utf8");
    const data = JSON.parse(json);
    const { pbkdf2Params, cipherParams, saltString, ivString, ciphertext } =
      data;
    const salt = Buffer.from(saltString, _BUFFER_ENCODING);
    const iv = Buffer.from(ivString, _BUFFER_ENCODING);
    return { pbkdf2Params, cipherParams, salt, iv, ciphertext };
  }

  private signPayload(encodedPayload: string): {
    sig: string;
  } {
    const hmac = crypto.createHmac("sha256", this.secret);
    hmac.update(encodedPayload);
    const sig = hmac.digest(_SIG_ENCODING);
    return { sig };
  }

  private verifyPayload(
    encodedPayload: string,
    sig: string,
  ): { isValid: boolean } {
    const { sig: expectedSig } = this.signPayload(encodedPayload);
    const isValid = sig === expectedSig;
    return { isValid };
  }

  private async getEncryptionKey(
    params: Pbkdf2Params,
    salt: Buffer,
  ): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(
        this.secret,
        salt,
        params.numIterations,
        params.keyLength,
        params.digest,
        (err, derivedKey) => {
          if (err) {
            throw err;
          }
          resolve(derivedKey);
        },
      );
    });
  }
}
