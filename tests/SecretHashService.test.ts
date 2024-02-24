import { SecretHashService } from "@/lib/services/hash";

describe("SecretHashService", () => {
  it("should return same hex for same data and secret", async () => {
    const s1 = new SecretHashService(secret(1));
    const s2 = new SecretHashService(secret(1));
    const data = "Moo Moo";
    const { result: r1 } = await s1.digest(data);
    const { result: r2 } = await s2.digest(data);
    expect(r1?.hashHex).toEqual(r2?.hashHex);
  });
  it("should return different hex for same data but different secret", async () => {
    const s1 = new SecretHashService(secret(1));
    const s2 = new SecretHashService(secret(2));
    const data = "Moo Moo";
    const { result: r1 } = await s1.digest(data);
    const { result: r2 } = await s2.digest(data);
    expect(r1?.hashHex).not.toEqual(r2?.hashHex);
  });
  it("should return different hex for different data but same secret", async () => {
    const s1 = new SecretHashService(secret(1));
    const s2 = new SecretHashService(secret(1));
    const data1 = "Moo Moo";
    const data2 = "Oink Oink";
    const { result: r1 } = await s1.digest(data1);
    const { result: r2 } = await s2.digest(data2);
    expect(r1?.hashHex).not.toEqual(r2?.hashHex);
  });
  it("should return lowercase hex strings", async () => {
    const s1 = new SecretHashService(secret(1));
    const d1 = "Message... received!";
    const { result: r1 } = await s1.digest(d1);
    expect(r1?.hashHex).toMatch(/[a-f0-9]{64}/);
  });
});

function secret(idx: number): string {
  return `my-password-${idx}`;
}
