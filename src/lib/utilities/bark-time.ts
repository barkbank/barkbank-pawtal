import { isValid, parse } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc, format } from "date-fns-tz";
import { removeConsecutiveSpaces } from "./bark-strings";

export const UTC = "UTC";
export const SINGAPORE_TIME_ZONE = "Asia/Singapore";
export const NEW_YORK_TIME_ZONE = "America/New_York";

export const YYYY_MM_DD_HH_MM_FORMAT = "yyyy-MM-dd HH:mm";
export const ISO8601_FORMAT = "yyyy-MM-dd'T'HH:mm:ssXXX";
export const UI_DATE_TIME_FORMAT = "d MMM yyyy h:mma";
export const UI_DATE_FORMAT = "d MMM yyyy";

export type DateTimeOptions = {
  /**
   * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
   */
  format: string;
  timeZone: string;
};

export const SGT_UI_DATE_TIME: DateTimeOptions = {
  format: UI_DATE_TIME_FORMAT,
  timeZone: SINGAPORE_TIME_ZONE,
} as const;

export const SGT_UI_DATE: DateTimeOptions = {
  format: UI_DATE_FORMAT,
  timeZone: SINGAPORE_TIME_ZONE,
} as const;

/**
 * Parse a date time string. Note that the timezone indicates the timezone of
 * the input string.
 *
 * @param dateTimeString Date time string to parse
 * @param options Options for parsing the string.
 * @returns Date
 */
export function parseDateTime(
  dateTimeString: string,
  options: DateTimeOptions,
): Date {
  const refDate = new Date();
  const zonedTime = utcToZonedTime(refDate, options.timeZone);
  const parsedTime = parse(dateTimeString, options.format, zonedTime);
  if (!isValid(parsedTime)) {
    throw new Error(`Invalid date time input: ${dateTimeString}`);
  }
  const utcTime = zonedTimeToUtc(parsedTime, options.timeZone);
  return utcTime;
}

export function formatDateTime(
  utcTime: Date,
  options: DateTimeOptions,
): string {
  const zonedTime = utcToZonedTime(utcTime, options.timeZone);
  const dateTimeString = format(zonedTime, options.format, {
    timeZone: options.timeZone,
  });
  return dateTimeString;
}

const COMMON_DATE_TIME_FORMATS = [
  "yyyy-MM-dd'T'HH:mm",
  "yyyy-MM-dd HH:mm",

  "dd MMM yyyy, HH:mm",
  "dd MMM yyyy HH:mm",
  "d MMM yyyy, HH:mm",
  "d MMM yyyy HH:mm",

  "dd MMMM yyyy, HH:mm",
  "dd MMMM yyyy HH:mm",
  "d MMMM yyyy, HH:mm",
  "d MMMM yyyy HH:mm",

  "dd MMM yyyy, h:mma",
  "dd MMM yyyy, h:mm a",
  "dd MMM yyyy h:mma",
  "dd MMM yyyy h:mm a",

  "dd MMMM yyyy, h:mma",
  "dd MMMM yyyy, h:mm a",
  "dd MMMM yyyy h:mma",
  "dd MMMM yyyy h:mm a",

  "dd MMMM yyyy, ha",
  "dd MMMM yyyy, h a",
  "dd MMMM yyyy ha",
  "dd MMMM yyyy h a",

  "MMMM do yyyy, h:mma",
  "MMM do yyyy, h:mm a",
];

/**
 * Parse common representations of date and time. The timezone indicates the
 * zone of the input string.
 */
export function parseCommonDateTime(
  dateTimeString: string,
  timeZone: string,
): Date {
  const val = removeConsecutiveSpaces(dateTimeString);
  for (const format of COMMON_DATE_TIME_FORMATS) {
    try {
      const parsedDate = parseDateTime(val, { format, timeZone });
      return parsedDate;
    } catch {
      continue;
    }
  }
  throw new Error(`No common format for datetime value: ${dateTimeString}`);
}

const COMMON_DATE_FORMATS = [
  "yyyy-MM-dd",
  "dd MMM yyyy",
  "d MMM yyyy",
  "dd MMMM yyyy",
  "d MMMM yyyy",
  "MMMM do yyyy",
  "MMM do yyyy",
];

export function parseCommonDate(dateString: string, timeZone: string): Date {
  const val = removeConsecutiveSpaces(dateString);
  for (const format of COMMON_DATE_FORMATS) {
    try {
      const parsedDate = parseDateTime(val, { format, timeZone });
      return parsedDate;
    } catch {
      continue;
    }
  }
  throw new Error(`No common format for date value: ${dateString}`);
}
