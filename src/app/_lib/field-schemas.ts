import { z } from "zod";
import {
  SINGAPORE_TIME_ZONE,
  parseCommonDateTime,
} from "../../lib/utilities/bark-time";
import {
  isIntegerString,
  isValidWeightKg,
  parseWeightKg,
} from "../../lib/utilities/bark-utils";

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
};
