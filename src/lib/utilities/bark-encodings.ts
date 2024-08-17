export function toBase64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

export function fromBase64(b64Encoded: string): string {
  return Buffer.from(b64Encoded, "base64").toString("utf8");
}
