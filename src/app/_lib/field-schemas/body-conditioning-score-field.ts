import { parseInt } from "lodash";
import { AbstractStringParserField } from "./abstract-string-parser-field";

export class BodyConditioningScoreField extends AbstractStringParserField<number> {
  static new() {
    return new BodyConditioningScoreField();
  }
  isOptional(): boolean {
    return false;
  }
  getMessage(): string {
    return "BCS should be a value between 1-9";
  }
  parse(value: string): number {
    const intValue = parseInt(value);
    if (intValue < 1 || intValue > 9) {
      throw new Error(this.getMessage());
    }
    return intValue;
  }
}
