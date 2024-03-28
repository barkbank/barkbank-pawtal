import { parseDateTime } from "@/lib/bark-time";
import { BARK_UTC, getAgeYears } from "@/lib/bark-utils";

describe("bark-utils", () => {
  describe("BARK_UTC", () => {
    it("can be used to parse UTC YYYY-MM-DD strings", () => {
      expect(BARK_UTC.parseDate("2023-01-09")).toEqual(
        BARK_UTC.getDate(2023, 1, 9),
      );
    });
    it("can format UTC dates as YYYY-MM-DD strings", () => {
      const utcDate = BARK_UTC.getDate(1998, 12, 17);
      expect(BARK_UTC.formatDate(utcDate)).toEqual("1998-12-17");
    });
  });
});

describe("getAgeYears", () => {
  it("should return 0 when two dates are less than a year apart", () => {
    const t0 = parseDateTime("2022-05-05 00:00");
    const t1 = parseDateTime("2023-05-04 23:59");
    expect(getAgeYears(t0, t1)).toEqual(0);
  });
  it("should return 1 when two dates are exactly a year apart", () => {
    const t0 = parseDateTime("2022-05-05 00:00");
    const t1 = parseDateTime("2023-05-05 00:00");
    expect(getAgeYears(t0, t1)).toEqual(1);
  });
  it("should return 8 when two dates are just under 9 years apart", () => {
    const t0 = parseDateTime("2010-05-05 00:00");
    const t1 = parseDateTime("2019-05-04 00:00");
    expect(getAgeYears(t0, t1)).toEqual(8);
  });
});
