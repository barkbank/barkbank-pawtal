import {
  SINGAPORE_TIME_ZONE,
  UI_DATE_FORMAT,
  formatDateTime,
  parseCommonDate,
} from "@/lib/utilities/bark-time";
import { AbstractStringParserField } from "./abstract-string-parser-field";

export class RequiredDateField extends AbstractStringParserField<Date> {
  static new() {
    return new RequiredDateField({ timeZone: SINGAPORE_TIME_ZONE });
  }

  constructor(private args: { timeZone: string }) {
    super();
  }

  isOptional(): boolean {
    return false;
  }

  getMessage(): string {
    return "Please enter a date. E.g. 28 Apr 2022";
  }

  parse(value: string): Date {
    return parseCommonDate(value, this.args.timeZone);
  }

  format(value: Date): string {
    return formatDateTime(value, {
      format: UI_DATE_FORMAT,
      timeZone: this.args.timeZone,
    });
  }
}
