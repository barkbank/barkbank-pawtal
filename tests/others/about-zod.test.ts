import { z } from "zod";

describe("About Zod", () => {
  it("The parse() function plucks out the fields for the schema", () => {
    const Schema1 = z.object({
      field1: z.string(),
      field2: z.string(),
      field3: z.string(),
    });
    const Schema2 = z.object({
      field2: z.string(),
    });

    const obj1 = {
      field1: "Value 1",
      field2: "Value 2",
      field3: "Value 3",
    };

    const obj2: any = Schema2.parse(obj1);
    expect(obj2.field1).toBeUndefined();
    expect(obj2.field2).not.toBeUndefined();
    expect(obj2.field3).toBeUndefined();
  });
});
