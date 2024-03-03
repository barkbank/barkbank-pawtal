import { DogStatus } from "@/lib/data/models";

describe("models", () => {
  describe("DogStatus enumeration", () => {
    it("is an enumeration of strings", () => {
      expect(DogStatus.NEW_PROFILE).toBe("NEW_PROFILE");
      expect(typeof DogStatus.NEW_PROFILE).toBe("string");
    });
  });
});
