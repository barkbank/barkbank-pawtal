import { HashService, SecretHashService } from "@/lib/services/hash";
import { OtpConfig, OtpServiceImpl } from "@/lib/services/otp";

describe("OtpServiceImpl", () => {
  it("should raise an exception when OTP length is too long", () => {
    expect(() => new OtpServiceImpl(otpConfig({ otpLength: 10 }))).toThrow(
      Error,
    );
  });
  describe("getOtp", () => {
    it("should return OTPs of the configured length", async () => {
      const config = otpConfig({ otpLength: 9 });
      const service = new OtpServiceImpl(config);
      const otp = await service.getOtp("my@email.com", 788);
      expect(otp).toMatch(/^[0-9]{9}$/);
    });
    it("should be deterministic", async () => {
      const config = otpConfig();
      const service = new OtpServiceImpl(config);
      const otp1 = await service.getOtp("value1", 10);
      const otp2 = await service.getOtp("value1", 10);
      expect(otp1).toEqual(otp2);
    });
    it("should return different OTPs for different periods", async () => {
      const config = otpConfig();
      const service = new OtpServiceImpl(config);
      const otp1 = await service.getOtp("value1", 10);
      const otp2 = await service.getOtp("value1", 11);
      expect(otp1).not.toBe(otp2);
    });
    it("should return different OTPs for different values", async () => {
      const config = otpConfig();
      const service = new OtpServiceImpl(config);
      const otp1 = await service.getOtp("value1", 10);
      const otp2 = await service.getOtp("value2", 10);
      expect(otp1).not.toBe(otp2);
    });
    it("should return different OTPs for different server secrets", async () => {
      const service1 = new OtpServiceImpl(
        otpConfig({ otpHashService: otpHashService(1) }),
      );
      const service2 = new OtpServiceImpl(
        otpConfig({ otpHashService: otpHashService(2) }),
      );
      const otp1 = service1.getOtp("value1", 10);
      const otp2 = service2.getOtp("value1", 10);
      expect(otp1).not.toBe(otp2);
      expect(otp1).not.toBe(otp2);
    });
  });
  describe("getCurrentOtp", () => {
    it("should return an OTP", async () => {
      const config = otpConfig({ otpLength: 5 });
      const service = new OtpServiceImpl(config);
      const otp = await service.getCurrentOtp("my@email.com");
      expect(otp).toMatch(/^[0-9]{5}$/);
    });
  });
  describe("getRecentOtps", () => {
    it("should return an array of OTPs", async () => {
      const config = otpConfig({ otpRecentPeriods: 11 });
      const service = new OtpServiceImpl(config);
      const otps = await service.getRecentOtps("my@email.com");
      expect(otps.length).toEqual(11);
    });
  });
});

function otpConfig(overrides?: {
  otpLength?: number;
  otpRecentPeriods?: number;
  otpHashService?: HashService;
}): OtpConfig {
  return {
    otpLength: 6,
    otpPeriodMillis: 15000,
    otpRecentPeriods: 4,
    otpHashService: otpHashService(1),
    ...overrides,
  };
}

function otpHashService(idx: number): HashService {
  return new SecretHashService(`secret${idx}`);
}
