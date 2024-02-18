import crypto from "crypto";

const OTP_LENGTH = 6;
const OTP_MODULUS = Math.pow(10, OTP_LENGTH);

const POSITIVE_31_BIT_MASK = 0x7fffffff;
const NUM_CHARS_PER_32_BITS = 8;
const BASE_16 = 16;

export function getOtp(args: {
  email: string;
  period: number;
  serverSecret: string;
}): string {
  const { email, period, serverSecret } = args;
  const hmac = crypto.createHmac("sha256", serverSecret);
  hmac.update(`e:${email}`);
  hmac.update(`p:${period}`);
  const hashHex = hmac.digest("hex");
  const n = hashHex.length;
  let i = 0;
  let j = NUM_CHARS_PER_32_BITS;
  let xoredValue = 0;
  while (i < n && j < n) {
    const sliceValue = parseInt(hashHex.slice(i, j), BASE_16);
    xoredValue ^= sliceValue;
    i += NUM_CHARS_PER_32_BITS;
    j += NUM_CHARS_PER_32_BITS;
  }
  const otp = (xoredValue & POSITIVE_31_BIT_MASK) % OTP_MODULUS;
  return otp.toString().padStart(OTP_LENGTH, "0");
}

export function getCurrentPeriod(periodDuration: number): number {
  const ts = new Date().getTime();
  return Math.floor(ts / periodDuration);
}
