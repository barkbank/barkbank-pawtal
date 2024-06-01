import { format, isValid, parse } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

export const UTC = "UTC";
export const SINGAPORE_TIME_ZONE = "Asia/Singapore";
export const NEW_YORK_TIME_ZONE = "America/New_York";
export const DEFAULT_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm";

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

export const UTC_DATETIME_OPTION: DateTimeOptions = {
  format: "yyyy-MM-dd'T'HH:mm",
  timeZone: UTC,
} as const;

/**
 * @param dateTimeString Date time string to parse
 * @param options Options for parsing the string
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
  const utcTime = zonedTimeToUtc(parsedTime, opts.timeZone);
  return utcTime;
}

export function formatDateTime(
  utcTime: Date,
  options?: DateTimeOptions,
): string {
  const opts = { ...DEFAULT_DATE_TIME_OPTIONS, ...options };
  const zonedTime = utcToZonedTime(utcTime, opts.timeZone);
  const dateTimeString = format(zonedTime, opts.format);
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

  "MMMM do yyyy, h:mma",
  "MMM do yyyy, h:mm a",
];

/**
 * Parse common representations of date and time. This is not timezone aware.
 */
export function parseCommonDateTime(dateTimeString: string): Date {
  for (const format of COMMON_DATE_TIME_FORMATS) {
    const parsedDate = parse(dateTimeString, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  throw new Error(`Cannot understand datetime value: ${dateTimeString}`);
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
