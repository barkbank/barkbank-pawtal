import crypto from "crypto";

const POSITIVE_31_BIT_MASK = 0x7fffffff;
const NUM_CHARS_PER_32_BITS = 8;
const BASE_16 = 16;

/**
 * Max 32-bit signed integer is 2147483647. So the max OTP length cannot be more
 * than 9.
 */
const MAX_OTP_LENGTH = 9;

export type OtpConfig = {
  otpLength: number;
  otpRecentPeriods: number;
  otpPeriodMillis: number;
  otpServerSecret: string;
};

export class OtpService {
  private config: OtpConfig;
  private otpModulus: number;

  public constructor(config: OtpConfig) {
    if (config.otpLength > MAX_OTP_LENGTH) {
      throw new Error(`OTP length cannot be more than ${MAX_OTP_LENGTH}`);
    }
    this.config = config;
    this.otpModulus = Math.pow(10, config.otpLength);
  }

  public getCurrentOtp(value: string): string {
    const period = this.getCurrentPeriod();
    return this.getOtp(value, period);
  }

  public getRecentOtps(value: string): string[] {
    const currentPeriod = this.getCurrentPeriod();
    const otps: string[] = [];
    for (let i = -this.config.otpRecentPeriods + 1; i <= 0; ++i) {
      otps.push(this.getOtp(value, currentPeriod + i));
    }
    return otps;
  }

  private getCurrentPeriod(): number {
    const ts = new Date().getTime();
    return Math.floor(ts / this.config.otpPeriodMillis);
  }

  public getOtp(value: string, period: number): string {
    const hmac = crypto.createHmac("sha256", this.config.otpServerSecret);
    hmac.update(`v:${value}`);
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
    const otp = (xoredValue & POSITIVE_31_BIT_MASK) % this.otpModulus;
    return otp.toString().padStart(this.config.otpLength, "0");
  }
}
