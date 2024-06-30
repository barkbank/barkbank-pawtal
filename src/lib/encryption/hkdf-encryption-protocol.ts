import crypto from "crypto";
import { z } from "zod";
import { Err, Ok, Result } from "../utilities/result";
import { EncryptionProtocol } from "./encryption-protocol";

export const HkdfInputKeyMaterialSchema = z.object({
  ikmId: z
    .string()
    .min(1)
    .max(6)
    .refine((val) => {
      const parts = val.split(".");
      return parts.length === 1;
    }),
  ikmHex: z.string(),
});

export type HkdfInputKeyMaterial = z.infer<typeof HkdfInputKeyMaterialSchema>;

/**
 * Configuration for the protocol.
 *
 * "ikms" is an array of IKMs. When encrypting, the IKM at index 0 will be used.
 *
 * "purpose" is incorporated into the "info" during the key derivation step.
 */
export const HkdfConfigSchema = z.object({
  ikms: z.array(HkdfInputKeyMaterialSchema),
  purpose: z.string(),
});

export type HkdfConfig = z.infer<typeof HkdfConfigSchema>;

const _ENC2_ = "_ENC2_";

export class HkdfEncryptionProtocol implements EncryptionProtocol {
  private ikms: Record<string, Buffer>;
  private purpose: string;
  private ikmId: string;

  constructor(config: HkdfConfig) {
    const { ikms, purpose } = HkdfConfigSchema.parse(config);
    this.purpose = purpose;
    this.ikmId = ikms[0].ikmId;
    this.ikms = {};
    for (const ikm of ikms) {
      this.ikms[ikm.ikmId] = Buffer.from(ikm.ikmHex, "hex");
    }
  }

  name(): string {
    return "HkdfEncryptionProtocol";
  }

  async encrypt(data: string): Promise<Result<{ encrypted: string }, string>> {
    const { ikms, purpose, ikmId } = this;
    const { hkdfArgs } = _generateHkdfArgs({ ikms, ikmId, purpose });
    const { key: encKey } = await _deriveKey({ hkdfArgs, usage: "enc" });
    const { key: sigKey } = await _deriveKey({ hkdfArgs, usage: "sig" });
    const { cipherArgs } = _generateCipherArgs({ encKey: encKey });
    const { ciphertext } = _encrypt({ data, cipherArgs });
    const { hkdfParams } = _toHkdfParams({ hkdfArgs });
    const { cipherParams } = _toCipherParams({ cipherArgs });
    const { payload } = _toPayload({ hkdfParams, cipherParams, ciphertext });
    const { signature } = _sign({ sigKey, payload });
    const { encrypted } = _pack({ ikmId, signature, payload });
    return Ok({ encrypted });
  }

  async decrypt(encrypted: string): Promise<Result<{ data: string }, string>> {
    const { ikms } = this;

    const { ikmId, signature, payload } = _unpack({ encrypted });
    const { hkdfParams, cipherParams, ciphertext } = _fromPayload({ payload });

    const resHkdfArgs = _toHkdfArgs({ ikms, hkdfParams });
    if (resHkdfArgs.error !== undefined) {
      return Err(resHkdfArgs.error);
    }
    const { hkdfArgs } = resHkdfArgs.result;
    const { key: sigKey } = await _deriveKey({ hkdfArgs, usage: "sig" });
    const { signature: verificationSignature } = _sign({ sigKey, payload });
    if (!verificationSignature.equals(signature)) {
      return Err("Signature Verification Failure");
    }

    const { key: encKey } = await _deriveKey({ hkdfArgs, usage: "enc" });
    const { cipherArgs } = _toCipherArgs({ key: encKey, cipherParams });
    const { data } = _decrypt({ ciphertext, cipherArgs });
    return Ok({ data });
  }

  /**
   * @param encrypted A matching encrypted string has three dot delimited parts.
   * The first part is the literal string "_ENC2_" (for encoding 2). The second
   * part is a base64 encoded signature. The third part is a base64 encoded
   * payload.
   */
  isProtocolFor(encrypted: string): boolean {
    const parts = encrypted.split(".");
    return parts.length === 4 && parts[0] === _ENC2_;
  }
}

const _HkdfDigestSchema = z.enum(["sha256", "sha384", "sha512"]);

/**
 * Parameters for calling crypto.hkdf
 * https://nodejs.org/api/crypto.html#cryptohkdfdigest-ikm-salt-info-keylen-callback
 *
 * "purpose" will be combined with literal strings "enc" or "sig" to generate
 * separate keys for encryption and signing.
 */
const _HkdfParamsSchema = z.object({
  ikmId: z.string(),
  digest: _HkdfDigestSchema,
  saltB64: z.string(),
  purpose: z.string(),
  keylen: z.number(),
});

const _CipherAlgorithmSchema = z.enum(["aes-256-cbc"]);

/**
 * Parameters for calling crypto.createCipheriv or crypto.createDecipheriv
 * https://nodejs.org/api/crypto.html#cryptocreatecipherivalgorithm-key-iv-options
 * https://nodejs.org/api/crypto.html#cryptocreatedecipherivalgorithm-key-iv-options
 */
const _CipherParamsSchema = z.object({
  algorithm: _CipherAlgorithmSchema,
  ivB64: z.string(),
});

const _PayloadSchema = z.object({
  hkdfParams: _HkdfParamsSchema,
  cipherParams: _CipherParamsSchema,
  ciphertext: z.string(),
});

type _HkdfDigest = z.infer<typeof _HkdfDigestSchema>;
type _HkdfParams = z.infer<typeof _HkdfParamsSchema>;
type _CipherAlgorithm = z.infer<typeof _CipherAlgorithmSchema>;
type _CipherParams = z.infer<typeof _CipherParamsSchema>;

type _HkdfArgs = {
  ikmId: string;
  ikm: Buffer;
  digest: _HkdfDigest;
  salt: Buffer;
  purpose: string;
  keylen: number;
};

type _CipherArgs = {
  algorithm: _CipherAlgorithm;
  key: Buffer;
  iv: Buffer;
};

function _generateHkdfArgs(args: {
  ikms: Record<string, Buffer>;
  ikmId: string;
  purpose: string;
}): { hkdfArgs: _HkdfArgs } {
  const { ikms, ikmId, purpose } = args;
  const ikm = ikms[ikmId];
  const digest = "sha256";
  const salt = crypto.randomBytes(32); // 256 bits
  const keylen = 32; // For "aes-256-cbc"
  const hkdfArgs: _HkdfArgs = { ikmId, ikm, digest, salt, purpose, keylen };
  return { hkdfArgs };
}

function _toHkdfArgs(args: {
  ikms: Record<string, Buffer>;
  hkdfParams: _HkdfParams;
}): Result<{ hkdfArgs: _HkdfArgs }, string> {
  const { ikms, hkdfParams } = args;
  const { ikmId, digest, saltB64, purpose, keylen } = hkdfParams;
  const ikm = ikms[ikmId];
  if (ikm === undefined) {
    return Err(`Unknown IKM ID: ${ikmId}`);
  }
  const salt = Buffer.from(saltB64, "base64");
  const hkdfArgs: _HkdfArgs = { ikmId, ikm, digest, salt, purpose, keylen };
  return Ok({ hkdfArgs });
}

function _toHkdfParams(args: { hkdfArgs: _HkdfArgs }): {
  hkdfParams: _HkdfParams;
} {
  const { hkdfArgs } = args;
  const { ikmId, digest, salt, purpose, keylen } = hkdfArgs;
  const saltB64 = salt.toString("base64");
  const params: _HkdfParams = { ikmId, digest, saltB64, purpose, keylen };
  const hkdfParams = _HkdfParamsSchema.parse(params);
  return { hkdfParams };
}

function _deriveKey(args: {
  hkdfArgs: _HkdfArgs;
  usage: "enc" | "sig";
}): Promise<{ key: Buffer }> {
  const { hkdfArgs, usage } = args;
  const { ikm, digest, salt, purpose, keylen } = hkdfArgs;
  const info = Buffer.from(`${purpose}.${usage}`, "utf8");
  return new Promise<{ key: Buffer }>((resolve) => {
    crypto.hkdf(digest, ikm, salt, info, keylen, (err, derivedKey) => {
      if (err) {
        throw err;
      }
      const key: Buffer = Buffer.from(derivedKey);
      resolve({ key });
    });
  });
}

function _generateCipherArgs(args: { encKey: Buffer }): {
  cipherArgs: _CipherArgs;
} {
  const { encKey } = args;
  const algorithm: _CipherAlgorithm = "aes-256-cbc";
  // "aes-256-cbc" needs an IV length of exactly 16 bytes
  const iv: Buffer = crypto.randomBytes(16);
  const cipherArgs = { algorithm, key: encKey, iv };
  return { cipherArgs };
}

function _toCipherParams(args: { cipherArgs: _CipherArgs }): {
  cipherParams: _CipherParams;
} {
  const { cipherArgs } = args;
  const { algorithm, iv } = cipherArgs;
  const ivB64 = iv.toString("base64");
  const cipherParams = { algorithm, ivB64 };
  return { cipherParams };
}

function _toCipherArgs(args: { key: Buffer; cipherParams: _CipherParams }): {
  cipherArgs: _CipherArgs;
} {
  const { key, cipherParams } = args;
  const { algorithm, ivB64 } = cipherParams;
  const iv = Buffer.from(ivB64, "base64");
  const cipherArgs = { algorithm, key, iv };
  return { cipherArgs };
}

function _encrypt(args: { data: string; cipherArgs: _CipherArgs }): {
  ciphertext: string;
} {
  const { data, cipherArgs } = args;
  const { algorithm, key, iv } = cipherArgs;
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const partialCiphertext = cipher.update(data, "utf8", "base64");
  const ciphertext = partialCiphertext + cipher.final("base64");
  return { ciphertext };
}

function _decrypt(args: { ciphertext: string; cipherArgs: _CipherArgs }): {
  data: string;
} {
  const { ciphertext, cipherArgs } = args;
  const { algorithm, key, iv } = cipherArgs;
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const partialData = decipher.update(ciphertext, "base64", "utf8");
  const data = partialData + decipher.final("utf8");
  return { data };
}

function _toPayload(args: {
  hkdfParams: _HkdfParams;
  cipherParams: _CipherParams;
  ciphertext: string;
}): { payload: Buffer } {
  const { hkdfParams, cipherParams, ciphertext } = args;
  const payloadObj = _PayloadSchema.parse({
    hkdfParams,
    cipherParams,
    ciphertext,
  });
  const payloadJson = JSON.stringify(payloadObj);
  const payload = Buffer.from(payloadJson, "utf8");
  return { payload };
}

function _fromPayload(args: { payload: Buffer }): {
  hkdfParams: _HkdfParams;
  cipherParams: _CipherParams;
  ciphertext: string;
} {
  const { payload } = args;
  const payloadJson = payload.toString("utf8");
  const payloadObj = JSON.parse(payloadJson);
  const { hkdfParams, cipherParams, ciphertext } =
    _PayloadSchema.parse(payloadObj);
  return { hkdfParams, cipherParams, ciphertext };
}

function _sign(args: { sigKey: Buffer; payload: Buffer }): {
  signature: Buffer;
} {
  const { sigKey, payload } = args;
  const hmac = crypto.createHmac("sha256", sigKey);
  hmac.update(payload);
  const signature = hmac.digest();
  return { signature };
}

function _pack(args: { ikmId: string; signature: Buffer; payload: Buffer }): {
  encrypted: string;
} {
  const { ikmId, signature, payload } = args;
  const sigB64 = signature.toString("base64");
  const payloadB64 = payload.toString("base64");
  const encrypted = `${_ENC2_}.${ikmId}.${sigB64}.${payloadB64}`;
  return { encrypted };
}

function _unpack(args: { encrypted: string }): {
  ikmId: string;
  signature: Buffer;
  payload: Buffer;
} {
  const { encrypted } = args;
  const parts = encrypted.split(".");
  const ikmId = parts[1];
  const signature = Buffer.from(parts[2], "base64");
  const payload = Buffer.from(parts[3], "base64");
  return { ikmId, signature, payload };
}
