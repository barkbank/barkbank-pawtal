import { isBlank, parseWeightKg } from "@/lib/utilities/bark-utils";
import { AbstractStringParserField } from "./abstract-string-parser-field";

export class OptionalDogWeightKgField extends AbstractStringParserField<
  number | null
> {
  static new() {
    return new OptionalDogWeightKgField();
  }
  constructor() {
    super({
      message: "Weight should be a positive number or empty",
      optional: true,
    });
  }

  parse(value: string): number | null {
    if (isBlank(value)) {
      return null;
    }
    return parseWeightKg(value)!;
  }
}
