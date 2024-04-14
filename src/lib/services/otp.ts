import { HashService } from "./hash";

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
  otpHashService: HashService;
};

export interface OtpService {
  getCurrentOtp(value: string): Promise<string>;
  getRecentOtps(value: string): Promise<string[]>;
}

export class DevelopmentOtpService implements OtpService {
  public async getCurrentOtp(value: string): Promise<string> {
    return "000000";
  }
  public async getRecentOtps(value: string): Promise<string[]> {
    return ["000000"];
  }
}

export class OtpServiceImpl implements OtpService {
  private config: OtpConfig;
  private otpModulus: number;

  public constructor(config: OtpConfig) {
    if (config.otpLength > MAX_OTP_LENGTH) {
      throw new Error(`OTP length cannot be more than ${MAX_OTP_LENGTH}`);
    }
    this.config = config;
    this.otpModulus = Math.pow(10, config.otpLength);
  }

  public async getCurrentOtp(value: string): Promise<string> {
    const period = this.getCurrentPeriod();
    return this.getOtp(value, period);
  }

  public async getRecentOtps(value: string): Promise<string[]> {
    const currentPeriod = this.getCurrentPeriod();
    const otpPromises: Promise<string>[] = [];
    for (let i = -this.config.otpRecentPeriods + 1; i <= 0; ++i) {
      otpPromises.push(this.getOtp(value, currentPeriod + i));
    }
    return Promise.all(otpPromises);
  }

  private getCurrentPeriod(): number {
    const ts = new Date().getTime();
    return Math.floor(ts / this.config.otpPeriodMillis);
  }

  public async getOtp(value: string, period: number): Promise<string> {
    const data = `v:${value}p:${period}`;
    const { result, error } = await this.config.otpHashService.digest(data);
    if (!result) {
      throw Error(error);
    }
    const { hashHex } = result;
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
