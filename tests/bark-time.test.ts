import {
  NEW_YORK_TIME_ZONE,
  SINGAPORE_TIME_ZONE,
  formatDateTime,
  parseDateTime,
} from "@/lib/bark-time";
import { parseISO } from "date-fns";

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
