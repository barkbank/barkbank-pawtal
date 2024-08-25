import { JSONSchema, JSONValue } from "@/lib/utilities/json-schema";

describe("json-schema", () => {
  function _shouldAccept(value: JSONValue) {
    return () => {
      expect(() => JSONSchema.parse(value)).not.toThrow();
    };
  }

  function _shouldReject(value: any) {
    return () => {
      expect(() => JSONSchema.parse(value)).toThrow();
    };
  }

  it("can be null", _shouldAccept(null));
  it("can be a boolean", _shouldAccept(true));
  it("can be an integer", _shouldAccept(123));
  it("can be a float", _shouldAccept(3.14));
  it("can be a string", _shouldAccept("hello"));
  it(
    "can be an array of mixed types",
    _shouldAccept([null, true, 123, 3.14, "hello"]),
  );
  it(
    "can be an object",
    _shouldAccept({
      "Is Array": false,
      "Is Object": true,
      "Colour Tags": ["red", "blue"],
      "2D Coordinates": [
        { X: 10, Y: 11 },
        { X: 20, Y: 12 },
      ],
    }),
  );

  it("cannot be date", _shouldReject(new Date()));
  it(
    "cannot be an object with date",
    _shouldReject({
      "Created Time": new Date(),
    }),
  );
});
