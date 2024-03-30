import crypto from "crypto";
import { Err, Ok, Result } from "../utilities/result";

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

/**
 * An implementation of EncryptionService that's based on a secret string and
 * PBKDF2. For production, consider AWS KMS.
 */
export class SecretEncryptionService extends ConvenientEncryptionService {
  private secret: string;
  private params: {
    pbkdf2Params: Pbkdf2Params;
    cipherParams: CipherParams;
  };

  public constructor(secret: string) {
    super();
    this.secret = secret;
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

  public async encrypt(
    data: string,
  ): Promise<Result<{ encryptedData: string }, string>> {
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
    const encryptedData = `${sig}.${payload}`;
    return Ok({ encryptedData });
  }

  public async decrypt(
    encryptedData: string,
  ): Promise<Result<{ data: string }, string>> {
    // Verify sig
    const [sig, payload] = encryptedData.split(".");
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
