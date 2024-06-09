import { z } from "zod";
import {
  SINGAPORE_TIME_ZONE,
  parseCommonDate,
  parseCommonDateTime,
} from "../../lib/utilities/bark-time";
import {
  isIntegerString,
  isValidWeightKg,
  parseWeightKg,
} from "../../lib/utilities/bark-utils";
import { parseCommonDuration } from "@/lib/utilities/parse-common-duration";
import { Duration } from "date-fns";
import { addDuration } from "@/lib/utilities/add-duration";

export const DateTimeField = {
  Schema: z.string().refine(
    (value) => {
      try {
        parseCommonDateTime(value, SINGAPORE_TIME_ZONE);
        return true;
      } catch (err) {
        return false;
      }
    },
    {
      message:
        "Unknown date time format, try something like '16 Apr 2021 4:30pm'",
    },
  ),
  parse: (value: string) => {
    return parseCommonDateTime(value, SINGAPORE_TIME_ZONE);
  },
};

export const DateField = {
  getSchema: (args?: { optional?: boolean }) =>
    z.string().refine(
      (value) => {
        if (value.trim() === "") {
          if (args?.optional === true) {
            return true;
          }
          return false;
        }
        try {
          parseCommonDate(value, SINGAPORE_TIME_ZONE);
          return true;
        } catch (err) {
          return false;
        }
      },
      {
        message: "Unknown date format, try something like '16 Apr 2021'",
      },
    ),
  parse: (value: string) => {
    return parseCommonDate(value, SINGAPORE_TIME_ZONE);
  },
};

// TODO: Change the other fields to classes like this one.
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

export const DogWeightKgField = {
  Schema: z.string().refine(
    (value: string) => {
      if (!value || value.trim() === "") {
        return false;
      }
      return isValidWeightKg(value);
    },
    {
      message: "Weight should be a positive number",
    },
  ),
  parse: (value: string) => {
    return parseWeightKg(value)!;
  },
};

export const BodyConditioningScoreField = {
  Schema: z.string().refine(
    (value: string) => {
      if (!isIntegerString(value)) return false;

      const bcs = Number(value);
      if (bcs < 1) return false;
      if (bcs > 9) return false;
      return true;
    },
    {
      message: "BCS should be a value between 1-9",
    },
  ),
  parse: (value: string) => {
    return Number(value);
  },
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};
