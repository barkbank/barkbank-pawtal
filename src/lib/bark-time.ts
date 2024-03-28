import { format, parse } from "date-fns";
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
