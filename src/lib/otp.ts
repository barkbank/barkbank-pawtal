import crypto from "crypto";

export const MILLIS_PER_PERIOD = 60000;

function secureHash(arg: string): string {
  const serverSecret = "a55b451605d17d7ed1cf7b38ee11c7ebdf9f6661";
  const hmac = crypto.createHmac("sha1", serverSecret);
  hmac.update(arg);
  const hash = hmac.digest("hex");
  const offset = parseInt(hash.slice(-1), 16);
  const otp =
    (parseInt(hash.slice(offset * 2, offset * 2 + 8), 16) & 0x7fffffff) %
    1000000;
  return otp.toString().padStart(6, "0");
}

export function getPeriodOtp(email: string, period: number): string {
  return secureHash(`${email}:${period}`);
}

export function getCurrentPeriod(): number {
  const ts = new Date().getTime();
  return Math.floor(ts / MILLIS_PER_PERIOD);
}
