import {
  SINGAPORE_TIME_ZONE,
  parseCommonDateTime,
} from "@/lib/utilities/bark-time";
import { AbstractStringParserField } from "./abstract-string-parser-field";

export class RequiredDateTimeField extends AbstractStringParserField<Date> {
  static new() {
    return new RequiredDateTimeField({ timeZone: SINGAPORE_TIME_ZONE });
  }

  constructor(private args: { timeZone: string }) {
    super();
  }

  isOptional(): boolean {
    return false;
  }

  getMessage(): string {
    return "Please enter a date and time. E.g. 28 Apr 2022, 4:30pm";
  }

  parse(value: string): Date {
    return parseCommonDateTime(value, this.args.timeZone);
  }
}
