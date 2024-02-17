import { MILLIS_PER_PERIOD, getCurrentPeriod, getPeriodOtp } from "@/lib/otp";

describe("otp", () => {
  describe("getCurrentPeriod", () => {
    it("should return the current period", () => {
      const ts = new Date().getTime();
      const period = Math.floor(ts / MILLIS_PER_PERIOD);
      const currentPeriod = getCurrentPeriod();
      expect(currentPeriod).toBeGreaterThanOrEqual(period - 1);
      expect(currentPeriod).toBeLessThanOrEqual(period + 1);
    });
  });
  describe("getOtp", () => {
    it("should be deterministic", () => {
      expect(getPeriodOtp("foo@email.com", 1)).toBe(
        getPeriodOtp("foo@email.com", 1),
      );
    });
    it("should return different OTPs for different periods", () => {
      expect(
        getPeriodOtp("foo@email.com", 1) === getPeriodOtp("foo@email.com", 2),
      ).toBe(false);
    });
    it("should return different OTPs for different emails", () => {
      expect(
        getPeriodOtp("foo@email.com", 1) === getPeriodOtp("bar@email.com", 1),
      ).toBe(false);
    });
  });
});
