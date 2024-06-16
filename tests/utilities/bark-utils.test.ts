import {
  UTC,
  YYYY_MM_DD_HH_MM_FORMAT,
  parseDateTime,
} from "@/lib/utilities/bark-time";
import { getAgeMonths } from "@/lib/utilities/bark-age";
import { getAgeYears } from "@/lib/utilities/bark-age";

describe("getAgeYears", () => {
  it("should return 0 when two dates are less than a year apart", () => {
    const t0 = getDate("2022-05-05 00:00");
    const t1 = getDate("2023-05-04 23:59");
    expect(getAgeYears(t0, t1)).toEqual(0);
  });
  it("should return 1 when two dates are exactly a year apart", () => {
    const t0 = getDate("2022-05-05 00:00");
    const t1 = getDate("2023-05-05 00:00");
    expect(getAgeYears(t0, t1)).toEqual(1);
  });
  it("should return 8 when two dates are just under 9 years apart", () => {
    const t0 = getDate("2010-05-05 00:00");
    const t1 = getDate("2019-05-04 00:00");
    expect(getAgeYears(t0, t1)).toEqual(8);
  });
});

describe("getAgeMonths", () => {
  it("should return 11 when two dates are just under a year apart", () => {
    const t0 = getDate("2022-05-05 00:00");
    const t1 = getDate("2023-05-04 23:59");
    expect(getAgeMonths(t0, t1)).toEqual(11);
  });
  it("should return 12 when two dates are exactly a year apart", () => {
    const t0 = getDate("2022-05-05 00:00");
    const t1 = getDate("2023-05-05 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(12);
  });
  it("should return 12 when two dates are just over a year apart", () => {
    const t0 = getDate("2010-05-05 00:00");
    const t1 = getDate("2011-05-06 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(12);
  });
  it("should return 36 when two dates are exactly 3 years apart", () => {
    const t0 = getDate("2010-05-05 00:00");
    const t1 = getDate("2013-05-05 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(36);
  });
  it("should return 2 when two dates are 2 months apart", () => {
    const t0 = getDate("2010-05-05 00:00");
    const t1 = getDate("2010-07-05 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(2);
  });
  it("should return 1 when two dates are just under 2 months apart", () => {
    const t0 = getDate("2010-05-05 00:00");
    const t1 = getDate("2010-07-04 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(1);
  });
  it("should return 2 when two dates are 2 months apart crossing a year boundary", () => {
    const t0 = getDate("2010-11-01 00:00");
    const t1 = getDate("2011-01-01 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(2);
  });
  it("should return 0 when two dates are 2 days apart crossing a month boundary", () => {
    const t0 = getDate("2010-11-29 00:00");
    const t1 = getDate("2010-12-01 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(0);
  });
  it("should return -1 when the fromTime is 2 days behind the toTime", () => {
    const t0 = getDate("2010-12-01 00:00");
    const t1 = getDate("2010-11-29 00:00");
    expect(getAgeMonths(t0, t1)).toEqual(-1);
  });
});

function getDate(value: string): Date {
  // TODO: We should use SGT.
  return parseDateTime(value, {
    format: YYYY_MM_DD_HH_MM_FORMAT,
    timeZone: UTC,
  });
}
