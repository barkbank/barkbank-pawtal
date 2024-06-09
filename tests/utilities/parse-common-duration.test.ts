import { parseCommonDuration } from "@/lib/utilities/parse-common-duration";

describe("parseCommonDuration", () => {
  it("returns correct duration", () => {
    expect(parseCommonDuration("7 years")).toEqual({ years: 7 });
    expect(parseCommonDuration("7 months")).toEqual({ months: 7 });
    expect(parseCommonDuration("7 weeks")).toEqual({ weeks: 7 });
    expect(parseCommonDuration("7 days")).toEqual({ days: 7 });
    expect(parseCommonDuration("7 hours")).toEqual({ hours: 7 });
    expect(parseCommonDuration("7 minutes")).toEqual({ minutes: 7 });
    expect(parseCommonDuration("7 seconds")).toEqual({ seconds: 7 });
  });

  it("understands shorthand for years", () => {
    expect(parseCommonDuration("3 years")).toEqual({ years: 3 });
    expect(parseCommonDuration("3 year")).toEqual({ years: 3 });
    expect(parseCommonDuration("3 yrs")).toEqual({ years: 3 });
    expect(parseCommonDuration("3 yr")).toEqual({ years: 3 });
    expect(parseCommonDuration("3y")).toEqual({ years: 3 });
  });

  it("understands shorthand for months", () => {
    expect(parseCommonDuration("4 months")).toEqual({ months: 4 });
    expect(parseCommonDuration("4 month")).toEqual({ months: 4 });
    expect(parseCommonDuration("4 mths")).toEqual({ months: 4 });
    expect(parseCommonDuration("4 mth")).toEqual({ months: 4 });
  });

  it("understands shorthand for months", () => {
    expect(parseCommonDuration("4 weeks")).toEqual({ weeks: 4 });
    expect(parseCommonDuration("4 week")).toEqual({ weeks: 4 });
    expect(parseCommonDuration("4 wks")).toEqual({ weeks: 4 });
    expect(parseCommonDuration("4 wk")).toEqual({ weeks: 4 });
    expect(parseCommonDuration("4w")).toEqual({ weeks: 4 });
  });

  it("understands shorthand for days", () => {
    expect(parseCommonDuration("60 days")).toEqual({ days: 60 });
    expect(parseCommonDuration("60 day")).toEqual({ days: 60 });
    expect(parseCommonDuration("60d")).toEqual({ days: 60 });
  });
});
