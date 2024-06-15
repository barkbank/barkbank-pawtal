import {
  SINGAPORE_TIME_ZONE,
  parseCommonDate,
} from "@/lib/utilities/bark-time";
import { AbstractStringParserField } from "./abstract-string-parser-field";

export class RequiredDateField extends AbstractStringParserField<Date> {
  static new() {
    return new RequiredDateField({ timeZone: SINGAPORE_TIME_ZONE });
  }
  constructor(private args: { timeZone: string }) {
    super({ message: "Please enter a date. E.g. 28 Apr 2022" });
  }

  parse(value: string): Date {
    return parseCommonDate(value, this.args.timeZone);
  }
}
