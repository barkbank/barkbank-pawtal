import { OtpConfig, OtpService } from "@/lib/services/otp";

describe("OtpService", () => {
  it("should raise an exception when OTP length is too long", () => {
    expect(() => new OtpService(otpConfig({ otpLength: 10 }))).toThrow(Error);
  });
  describe("getOtp", () => {
    it("should return OTPs of the configured length", () => {
      const config = otpConfig({ otpLength: 9 });
      const service = new OtpService(config);
      const otp = service.getOtp("my@email.com", 788);
      expect(otp).toMatch(/^[0-9]{9}$/);
    });
    it("should be deterministic", () => {
      const config = otpConfig();
      const service = new OtpService(config);
      const otp1 = service.getOtp("value1", 10);
      const otp2 = service.getOtp("value1", 10);
      expect(otp1).toEqual(otp2);
    });
    it("should return different OTPs for different periods", () => {
      const config = otpConfig();
      const service = new OtpService(config);
      const otp1 = service.getOtp("value1", 10);
      const otp2 = service.getOtp("value1", 11);
      expect(otp1).not.toBe(otp2);
    });
    it("should return different OTPs for different values", () => {
      const config = otpConfig();
      const service = new OtpService(config);
      const otp1 = service.getOtp("value1", 10);
      const otp2 = service.getOtp("value2", 10);
      expect(otp1).not.toBe(otp2);
    });
    it("should return different OTPs for different server secrets", () => {
      const service1 = new OtpService(otpConfig({ otpServerSecret: "s1" }));
      const service2 = new OtpService(otpConfig({ otpServerSecret: "s2" }));
      const otp1 = service1.getOtp("value1", 10);
      const otp2 = service2.getOtp("value1", 10);
      expect(otp1).not.toBe(otp2);
      expect(otp1).not.toBe(otp2);
    });
  });
  describe("getCurrentOtp", () => {
    it("should return an OTP", () => {
      const config = otpConfig({ otpLength: 5 });
      const service = new OtpService(config);
      const otp = service.getCurrentOtp("my@email.com");
      expect(otp).toMatch(/^[0-9]{5}$/);
    });
  });
  describe("getRecentOtps", () => {
    it("should return an array of OTPs", () => {
      const config = otpConfig({ otpRecentPeriods: 11 });
      const service = new OtpService(config);
      const otps = service.getRecentOtps("my@email.com");
      expect(otps.length).toEqual(11);
    });
  });
});

function otpConfig(overrides?: {
  otpLength?: number;
  otpServerSecret?: string;
  otpRecentPeriods?: number;
}): OtpConfig {
  return {
    otpLength: 6,
    otpPeriodMillis: 15000,
    otpRecentPeriods: 4,
    otpServerSecret: "serverSecret",
    ...overrides,
  };
}
