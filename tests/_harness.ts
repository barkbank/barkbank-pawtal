import { Ok, Result } from "@/lib/result";
import { EncryptionService } from "@/lib/services/encryption";
import { HashService } from "@/lib/services/hash";
import { OtpService } from "@/lib/services/otp";

export class HarnessHashService implements HashService {
  public async digest(
    data: string,
  ): Promise<Result<{ hashHex: string }, string>> {
    return Ok({ hashHex: await this.getHashHex(data) });
  }
  public async getHashHex(data: string): Promise<string> {
    return `hashed(${data})`;
  }
}

export class HarnessEncryptionService implements EncryptionService {
  public async encrypt(
    data: string,
  ): Promise<Result<{ encryptedData: string }, string>> {
    return Ok({
      encryptedData: await this.getEncryptedData(data),
    });
  }
  public async decrypt(
    encryptedData: string,
  ): Promise<Result<{ data: string }, string>> {
    return Ok({
      data: await this.getDecryptedData(encryptedData),
    });
  }
  public async getEncryptedData(data: string): Promise<string> {
    return `encrypted(${data})`;
  }
  public async getDecryptedData(encryptedData: string): Promise<string> {
    const i = "encrytped(".length;
    const j = encryptedData.length - 1;
    return encryptedData.slice(i, j);
  }
}

export class HarnessOtpService implements OtpService {
  static readonly CURRENT_OTP: string = "000000";
  static readonly INVALID_OTP: string = "999999";
  public async getCurrentOtp(value: string): Promise<string> {
    return HarnessOtpService.CURRENT_OTP;
  }

  public async getRecentOtps(value: string): Promise<string[]> {
    return [HarnessOtpService.CURRENT_OTP];
  }
}
