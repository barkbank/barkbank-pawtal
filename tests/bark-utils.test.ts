import { BARK_UTC } from "@/lib/bark-utils";

describe("bark-utils", () => {
  describe("BARK_UTC", () => {
    it("can be used to parse UTC YYYY-MM-DD strings", () => {
      expect(BARK_UTC.parseDate("2023-01-09")).toEqual(
        BARK_UTC.getDate(2023, 1, 9),
      );
    });
    it("can format UTC dates as YYYY-MM-DD strings", () => {
      const utcDate = BARK_UTC.getDate(1998, 12, 17);
      expect(BARK_UTC.formatDate(utcDate)).toEqual("1998-12-17");
    });
  });
});
