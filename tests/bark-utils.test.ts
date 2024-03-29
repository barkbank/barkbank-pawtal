import { parseDateTime } from "@/lib/utilities/bark-time";
import { BARK_UTC, getAgeMonths, getAgeYears } from "@/lib/utilities/bark-utils";

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

describe("getAgeMonths", () => {
  it("should return 11 when two dates are just under a year apart", () => {
    const t0 = parseDateTime("2022-05-05 00:00");
    const t1 = parseDateTime("2023-05-04 23:59");
    expect(getAgeMonths(t0, t1)).toEqual(11);
  });
  it("should return 12 when two dates are exactly a year apart", () => {
    const t0 = parseDateTime("2022-05-05 00:00");
    const t1 = parseDateTime("2023-05-05 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(12);
  });
  it("should return 12 when two dates are just over a year apart", () => {
    const t0 = parseDateTime("2010-05-05 00:00");
    const t1 = parseDateTime("2011-05-06 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(12);
  });
  it("should return 36 when two dates are exactly 3 years apart", () => {
    const t0 = parseDateTime("2010-05-05 00:00");
    const t1 = parseDateTime("2013-05-05 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(36);
  });
  it("should return 2 when two dates are 2 months apart", () => {
    const t0 = parseDateTime("2010-05-05 00:00");
    const t1 = parseDateTime("2010-07-05 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(2);
  });
  it("should return 1 when two dates are just under 2 months apart", () => {
    const t0 = parseDateTime("2010-05-05 00:00");
    const t1 = parseDateTime("2010-07-04 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(1);
  });
  it("should return 2 when two dates are 2 months apart crossing a year boundary", () => {
    const t0 = parseDateTime("2010-11-01 00:00");
    const t1 = parseDateTime("2011-01-01 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(2);
  });
  it("should return 0 when two dates are 2 days apart crossing a month boundary", () => {
    const t0 = parseDateTime("2010-11-29 00:00");
    const t1 = parseDateTime("2010-12-01 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(0);
  });
  it("should return -1 when the fromTime is 2 days behind the toTime", () => {
    const t0 = parseDateTime("2010-12-01 00:00");
    const t1 = parseDateTime("2010-11-29 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(-1);
  });
});
