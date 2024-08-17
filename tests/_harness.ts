import { Err, Ok, Result } from "@/lib/utilities/result";
import { EncryptionService } from "@/lib/services/encryption";
import { HashService } from "@/lib/services/hash";
import { OtpService } from "@/lib/services/otp";
import { Email, EmailService } from "@/lib/services/email";
import { fromBase64, toBase64 } from "@/lib/utilities/bark-encodings";

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
  private secret: string;
  public constructor(secret: string) {
    this.secret = secret;
  }
  public async getEncryptedData(data: string): Promise<string> {
    const payload = {
      salt: `${Date.now()} ${Math.random()}`,
      secret: this.secret,
      data,
    };
    const jsonEncoded = JSON.stringify(payload);
    // Use a Base64 encoding so that we can write tests that verify encryption
    // by checking for the presence of certain secret values. For example,...
    //
    //     expect(encrypted).not.toContain(secret)
    //
    return toBase64(jsonEncoded);
  }
  public async getDecryptedData(encryptedData: string): Promise<string> {
    const jsonEncoded = fromBase64(encryptedData);
    const obj = JSON.parse(jsonEncoded);
    if (obj.secret !== this.secret) {
      throw new Error(`Failed to decrypt: ${encryptedData}`);
    }
    return obj.data;
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

export class HarnessEmailService implements EmailService {
  public emails: Email[] = [];
  public async sendEmail(email: Email): Promise<Result<true, "FAILED">> {
    this.emails.push(email);
    return Ok(true);
  }
}

export class HarnessFailureEmailService implements EmailService {
  public async sendEmail(email: Email): Promise<Result<true, "FAILED">> {
    return Err("FAILED");
  }
}
