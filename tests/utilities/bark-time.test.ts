import {
  NEW_YORK_TIME_ZONE,
  SINGAPORE_TIME_ZONE,
  formatDateTime,
  parseCommonDateTime,
  parseDateTime,
} from "@/lib/utilities/bark-time";
import { parse, parseISO } from "date-fns";

describe("bark-time parseDateTime", () => {
  it("should parse yyyy-MM-dd HH:mm strings into UTC Dates", () => {
    const d1 = parseDateTime("2019-09-27 06:00");
    const d2 = parseISO("2019-09-27T06:00:00Z");
    expect(d1).toEqual(d2);
  });
  it("should parse yyyy-MM-dd HH:mm strings at time zone into UTC Dates", () => {
    const d1 = parseDateTime("27 Sep 2019, 06:00", {
      format: "d MMM y, HH:mm",
      timeZone: SINGAPORE_TIME_ZONE,
    });
    const d2 = parseISO("2019-09-26T22:00:00Z");
    expect(d1).toEqual(d2);
  });
});

describe("bark-time formatDateTime", () => {
  it("should format UTC Dates into yyyy-MM-dd HH:mm strings", () => {
    const utcDate = parseISO("2017-11-06T21:33:21Z");
    const dateTimeString = formatDateTime(utcDate);
    expect(dateTimeString).toEqual("2017-11-06 21:33");
  });
  it("should format UTC Dates for the specified time zone and format (Singapore)", () => {
    const utcDate = parseISO("2017-11-06T21:33:21Z");
    const formatted = formatDateTime(utcDate, {
      format: "dd/MM/yyyy HH:mm",
      timeZone: SINGAPORE_TIME_ZONE,
    });
    expect(formatted).toEqual("07/11/2017 05:33");
  });
  it("should format UTC Dates for the specified time zone and format (New York)", () => {
    const utcDate = parseISO("2017-11-06T21:33:21Z");
    const formatted = formatDateTime(utcDate, {
      format: "MMM d, yyyy, HH:mm:ss",
      timeZone: NEW_YORK_TIME_ZONE,
    });
    expect(formatted).toEqual("Nov 6, 2017, 16:33:21");
  });
});

describe("bark-time parseCommonDateTime", () => {
  const getExpected = (val: string) => {
    return parse(val, "yyyy-MM-dd'T'HH:mm", new Date());
  };
  it("should understand 2021-05-03T10:25", () => {
    const expected = getExpected("2021-05-03T10:25");
    const actual = parseCommonDateTime("2021-05-03T10:25");
    expect(actual).toEqual(expected);
  });
  it("should understand 23 May 2021, 10:25", () => {
    const expected = getExpected("2021-05-23T10:25");
    const actual = parseCommonDateTime("23 May 2021, 10:25");
    expect(actual).toEqual(expected);
  });
  it("should understand 23 May 2021 10:25", () => {
    const expected = getExpected("2021-05-23T10:25");
    const actual = parseCommonDateTime("23 May 2021 10:25");
    expect(actual).toEqual(expected);
  });
  it("should understand 3 May 2021, 10:25", () => {
    const expected = getExpected("2021-05-03T10:25");
    const actual = parseCommonDateTime("3 May 2021, 10:25");
    expect(actual).toEqual(expected);
  });
  it("should understand 03 May 2021, 10:25", () => {
    const expected = getExpected("2021-05-03T10:25");
    const actual = parseCommonDateTime("03 May 2021, 10:25");
    expect(actual).toEqual(expected);
  });
  it("should understand 23 May 2021, 10:25PM", () => {
    const expected = getExpected("2021-05-23T22:25");
    const actual = parseCommonDateTime("23 May 2021, 10:25PM");
    expect(actual).toEqual(expected);
  });
  it("should understand 23 May 2021, 10:25 PM", () => {
    const expected = getExpected("2021-05-23T22:25");
    const actual = parseCommonDateTime("23 May 2021, 10:25 PM");
    expect(actual).toEqual(expected);
  });
  it("should understand 23 May 2021 10:25 PM", () => {
    const expected = getExpected("2021-05-23T22:25");
    const actual = parseCommonDateTime("23 May 2021 10:25 PM");
    expect(actual).toEqual(expected);
  });
  it("should understand May 23rd 2021, 10:25pm", () => {
    const expected = getExpected("2021-05-23T22:25");
    const actual = parseCommonDateTime("May 23rd 2021, 10:25pm");
    expect(actual).toEqual(expected);
  });
  it("should understand 2021-05-03 10:25", () => {
    const expected = getExpected("2021-05-03T10:25");
    const actual = parseCommonDateTime("2021-05-03 10:25");
    expect(actual).toEqual(expected);
  });
  it("should understand 4 August 2022, 13:30", () => {
    const expected = getExpected("2022-08-04T13:30");
    const actual = parseCommonDateTime("4 August 2022, 13:30");
    expect(actual).toEqual(expected);
  });
  it("should understand 4 Aug 2022, 13:30", () => {
    const expected = getExpected("2022-08-04T13:30");
    const actual = parseCommonDateTime("4 Aug 2022, 13:30");
    expect(actual).toEqual(expected);
  });
});
