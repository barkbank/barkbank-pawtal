import { addDuration } from "@/lib/utilities/add-duration";
import { parseCommonDate } from "@/lib/utilities/bark-time";
import { parseCommonDuration } from "@/lib/utilities/parse-common-duration";
import { z } from "zod";

export class DateOrDurationField {
  constructor(private args: { optional: boolean; timeZone: string }) {}
  schema() {
    return z.string().refine(
      (value) => {
        if (value.trim() === "") {
          return this.args.optional;
        }
        return this.isDate(value) || this.isDuration(value);
      },
      {
        message:
          "Neither a date (e.g. 16 Apr 2021) or a duration (e.g. 30 days)",
      },
    );
  }
  isDate(value: string): boolean {
    try {
      this.parseDate(value);
      return true;
    } catch {
      return false;
    }
  }
  isDuration(value: string): boolean {
    try {
      this.parseDuration(value);
      return true;
    } catch {
      return false;
    }
  }
  parseDate(value: string): Date {
    return parseCommonDate(value, this.args.timeZone);
  }
  parseDuration(value: string): Duration {
    return parseCommonDuration(value);
  }
  resolveDate(args: { reference: Date; value: string }): Date {
    const { reference, value } = args;
    if (this.isDate(value)) {
      return this.parseDate(value);
    }
    return addDuration(reference, this.parseDuration(value));
  }
}
