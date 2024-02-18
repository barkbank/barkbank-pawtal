import { getCurrentPeriod, getOtp } from "@/lib/otp";

describe("otp", () => {
  describe("getCurrentPeriod", () => {
    it("should return the current period", () => {
      const periodDuration = 60000;
      const ts = new Date().getTime();
      const period = Math.floor(ts / periodDuration);
      const currentPeriod = getCurrentPeriod(periodDuration);
      expect(currentPeriod).toBeGreaterThanOrEqual(period - 1);
      expect(currentPeriod).toBeLessThanOrEqual(period + 1);
    });
  });
  describe("getOtp", () => {
    it("should have 6 digits", () => {
      for (let period = 0; period < 20; ++period) {
        const otp = getOtp({
          email: "foo@example.com",
          period: period,
          serverSecret: "secretSauce",
        });
        expect(otp).toMatch(/^[0-9]{6}$/);
      }
    });
    it("should be deterministic", () => {
      const otp1 = getOtp({
        email: "foo@email.com",
        period: 1,
        serverSecret: "secret1",
      });
      const otp2 = getOtp({
        email: "foo@email.com",
        period: 1,
        serverSecret: "secret1",
      });
      expect(otp1).toEqual(otp2);
    });
    it("should return different OTPs for different periods", () => {
      const otp1 = getOtp({
        email: "foo@email.com",
        period: 1,
        serverSecret: "secret1",
      });
      const otp2 = getOtp({
        email: "foo@email.com",
        period: 2,
        serverSecret: "secret1",
      });
      expect(otp1).not.toBe(otp2);
    });
    it("should return different OTPs for different emails", () => {
      const otp1 = getOtp({
        email: "foo@email.com",
        period: 1,
        serverSecret: "secret1",
      });
      const otp2 = getOtp({
        email: "bar@email.com",
        period: 1,
        serverSecret: "secret1",
      });
      expect(otp1).not.toBe(otp2);
    });
    it("should return different OTPs for different server secrets", () => {
      const otp1 = getOtp({
        email: "foo@email.com",
        period: 1,
        serverSecret: "secret1",
      });
      const otp2 = getOtp({
        email: "foo@email.com",
        period: 1,
        serverSecret: "secret2",
      });
      expect(otp1).not.toBe(otp2);
    });
  });
});
