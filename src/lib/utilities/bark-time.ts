import { isValid, parse } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc, format } from "date-fns-tz";
import { removeConsecutiveSpaces } from "./bark-strings";

export const UTC = "UTC";
export const SINGAPORE_TIME_ZONE = "Asia/Singapore";
export const NEW_YORK_TIME_ZONE = "America/New_York";
export const DEFAULT_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm";
export const ISO8601_FORMAT = "yyyy-MM-dd'T'HH:mm:ssXXX";

export type DateTimeOptions = {
  /**
   * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
   */
  format: string;
  timeZone: string;
};

const DEFAULT_DATE_TIME_OPTIONS: DateTimeOptions = {
  format: DEFAULT_DATE_TIME_FORMAT,
  timeZone: UTC,
} as const;

export const UTC_DATE_OPTION: DateTimeOptions = {
  format: "yyyy-MM-dd",
  timeZone: UTC,
} as const;

export const UTC_ISO8601: DateTimeOptions = {
  format: "yyyy-MM-dd'T'HH:mm:ssXXX",
  timeZone: UTC,
} as const;

export const SGT_ISO8601: DateTimeOptions = {
  format: "yyyy-MM-dd'T'HH:mm:ssXXX",
  timeZone: SINGAPORE_TIME_ZONE,
} as const;

export const SGT_UI_DATE_TIME: DateTimeOptions = {
  format: "d MMM yyyy h:mma",
  timeZone: SINGAPORE_TIME_ZONE,
} as const;

export const SGT_UI_DATE: DateTimeOptions = {
  format: "d MMM yyyy",
  timeZone: SINGAPORE_TIME_ZONE,
} as const;

/**
 * Parse a date time string. Note that the timezone indicates the timezone of
 * the input string.
 *
 * @param dateTimeString Date time string to parse
 * @param options Options for parsing the string.
 * @returns UCT Date
 */
export function parseDateTime(
  dateTimeString: string,
  options?: DateTimeOptions,
): Date {
  const opts = { ...DEFAULT_DATE_TIME_OPTIONS, ...options };
  const refDate = new Date();
  const zonedTime = utcToZonedTime(refDate, opts.timeZone);
  const parsedTime = parse(dateTimeString, opts.format, zonedTime);
  if (!isValid(parsedTime)) {
    throw new Error(`Invalid date time input: ${dateTimeString}`);
  }
  const utcTime = zonedTimeToUtc(parsedTime, opts.timeZone);
  return utcTime;
}

export function formatDateTime(
  utcTime: Date,
  options?: DateTimeOptions,
): string {
  const opts = { ...DEFAULT_DATE_TIME_OPTIONS, ...options };
  const zonedTime = utcToZonedTime(utcTime, opts.timeZone);
  const dateTimeString = format(zonedTime, opts.format, {
    timeZone: opts.timeZone,
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

/**
 * @deprecated
 */
export const BARK_UTC = {
  getDate: (year: number, month: number, day: number) => {
    return new Date(Date.UTC(year, month - 1, day));
  },
  parseDate: (yyyy_mm_dd: string) => {
    return new Date(`${yyyy_mm_dd}T00:00:00Z`);
  },
  formatDate: (utcDate: Date) => {
    return utcDate.toISOString().split("T")[0];
  },
};
