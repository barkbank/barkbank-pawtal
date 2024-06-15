import {
  isBlank,
  isValidWeightKg,
  parseWeightKg,
} from "@/lib/utilities/bark-utils";
import { z } from "zod";

export class RequiredDogWeightKgField {
  static new() {
    return new RequiredDogWeightKgField();
  }
  schema() {
    return z.string().refine(
      (value: string) => {
        if (isBlank(value)) {
          return false;
        }
        return isValidWeightKg(value);
      },
      {
        message: "Weight should be a positive number",
      },
    );
  }

  parse(value: string): number {
    return parseWeightKg(value)!;
  }
}
