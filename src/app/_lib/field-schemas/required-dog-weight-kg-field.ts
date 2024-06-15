import { parseWeightKg } from "@/lib/utilities/bark-utils";
import { AbstractStringParserField } from "./abstract-string-parser-field";

export class RequiredDogWeightKgField extends AbstractStringParserField<number> {
  static new() {
    return new RequiredDogWeightKgField();
  }

  isOptional(): boolean {
    return false;
  }

  getMessage(): string {
    return "Weight should be a positive number";
  }

  parse(value: string): number {
    return parseWeightKg(value)!;
  }
}
