import crypto from "crypto";

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
  let j = 8;
  let xoredValue = 0;
  while (i < n && j < n) {
    const sliceValue = parseInt(hashHex.slice(i, j));
    xoredValue ^= sliceValue;
    i += 8;
    j += 8;
  }
  const otp = (xoredValue & 0x7fffffff) % 1000000;
  return otp.toString().padStart(6, "0");
}

export function getCurrentPeriod(periodDuration: number): number {
  const ts = new Date().getTime();
  return Math.floor(ts / periodDuration);
}
