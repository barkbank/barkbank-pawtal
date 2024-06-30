import { standardEncryptionProtocolTests } from "./standard-encryption-protocol-tests";
import {
  HkdfConfig,
  HkdfEncryptionProtocol,
  HkdfInputKeyMaterial,
} from "@/lib/encryption/hkdf-encryption-protocol";
import { PbkdfEncryptionProtocol } from "@/lib/encryption/pbkdf-encryption-protocol";
import { sprintf } from "sprintf-js";

describe("HKDF Encryption Protocol", () => {
  it("passes standard encryption protocol tests", async () => {
    const protocol = new HkdfEncryptionProtocol(_config(1));
    const differentCredentials = new HkdfEncryptionProtocol(_config(2));
    const { error } = await standardEncryptionProtocolTests({
      protocol,
      differentCredentials,
    });
    expect(error).toBeUndefined();
  });
  it("should get unknown IKM ID when ikms does not contain a mapping", async () => {
    const config1: HkdfConfig = {
      ikms: [{ ikmId: "ikmid1", ikmHex: _ikmHex(111) }],
      purpose: "test",
    };
    const config2: HkdfConfig = {
      ikms: [{ ikmId: "ikmid2", ikmHex: _ikmHex(111) }],
      purpose: "test",
    };
    const p1 = new HkdfEncryptionProtocol(config1);
    const p2 = new HkdfEncryptionProtocol(config2);
    const enc = await p1.encrypt("Secret Message");
    const dec = await p2.decrypt(enc.result!.encrypted);
    expect(dec.error).toEqual("Unknown IKM ID: ikmid1");
  });
  it("should get signature verificaiton failure when IKM is different", async () => {
    const config1: HkdfConfig = {
      ikms: [{ ikmId: "matchingIkmID", ikmHex: _ikmHex(111) }],
      purpose: "test",
    };
    const config2: HkdfConfig = {
      ikms: [{ ikmId: "matchingIkmID", ikmHex: _ikmHex(222) }],
      purpose: "test",
    };
    const p1 = new HkdfEncryptionProtocol(config1);
    const p2 = new HkdfEncryptionProtocol(config2);
    const enc = await p1.encrypt("Secret Message");
    const dec = await p2.decrypt(enc.result!.encrypted);
    expect(dec.error).toEqual("Signature Verification Failure");
  });
  it("should return false for isProtocolFor when given encrypted string from PBKDF protocol", async () => {
    const p1 = new PbkdfEncryptionProtocol("secret1");
    const p2 = new HkdfEncryptionProtocol(_config(333));
    const enc = await p1.encrypt("Secret Message");
    expect(p2.isProtocolFor(enc.result!.encrypted)).toEqual(false);
  });
  it("can use old key to decrypt", async () => {
    const config1: HkdfConfig = {
      ikms: [{ ikmId: "key1", ikmHex: _ikmHex(2021) }],
      purpose: "test",
    };
    const config2: HkdfConfig = {
      ikms: [
        { ikmId: "key2", ikmHex: _ikmHex(2022) },
        { ikmId: "key1", ikmHex: _ikmHex(2021) },
      ],
      purpose: "test",
    };
    const p1 = new HkdfEncryptionProtocol(config1);
    const p2 = new HkdfEncryptionProtocol(config2);
    const enc = await p1.encrypt("Secret Message");
    const dec = await p2.decrypt(enc.result!.encrypted);
    expect(dec.result!.data).toEqual("Secret Message");
  });
});

function _config(idx: number): HkdfConfig {
  return {
    ikms: [_ikm(idx)],
    purpose: "test",
  };
}

function _ikm(idx: number): HkdfInputKeyMaterial {
  const ikmId = `IKM_${idx}`;
  const ikmHex = _ikmHex(idx);
  return { ikmId, ikmHex };
}

function _ikmHex(idx: number): string {
  return sprintf("%064x", idx);
}
