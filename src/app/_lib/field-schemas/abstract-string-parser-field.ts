import { isBlank } from "@/lib/utilities/bark-utils";
import { z } from "zod";

/**
 * An abstract field that parses string values into a generic type T. Validation
 * fails if the parser throws an exception.
 */
export abstract class AbstractStringParserField<T> {
  constructor(private abstractArgs: { message: string; optional?: boolean }) {}
  schema() {
    return z.string().refine(
      (value: string) => {
        if (isBlank(value)) {
          return this.isOptional();
        }
        try {
          this.parse(value);
          return true;
        } catch (err) {
          return false;
        }
      },
      {
        message: this.abstractArgs.message,
      },
    );
  }

  abstract parse(value: string): T;

  private isOptional(): boolean {
    return this.abstractArgs.optional ?? false;
  }
}
