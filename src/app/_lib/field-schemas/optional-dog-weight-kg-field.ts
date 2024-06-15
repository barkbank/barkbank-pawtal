import {
  isBlank,
  isValidWeightKg,
  parseWeightKg,
} from "@/lib/utilities/bark-utils";
import { z } from "zod";

export class OptionalDogWeightKgField {
  static new() {
    return new OptionalDogWeightKgField();
  }
  schema() {
    return z.string().refine(
      (value: string) => {
        if (isBlank(value)) {
          return true;
        }
        return isValidWeightKg(value);
      },
      {
        message: "Weight should be a positive number",
      },
    );
  }

  parse(value: string): number | null {
    if (isBlank(value)) {
      return null;
    }
    return parseWeightKg(value)!;
  }
}
