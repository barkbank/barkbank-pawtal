import { isBlank, parseWeightKg } from "@/lib/utilities/bark-utils";
import { AbstractStringParserField } from "./abstract-string-parser-field";

export class OptionalDogWeightKgField extends AbstractStringParserField<
  number | null
> {
  static new() {
    return new OptionalDogWeightKgField();
  }
  isOptional(): boolean {
    return true;
  }
  getMessage(): string {
    return "Weight should be a positive number or empty";
  }
  parse(value: string): number | null {
    if (isBlank(value)) {
      return null;
    }
    return parseWeightKg(value)!;
  }
}
