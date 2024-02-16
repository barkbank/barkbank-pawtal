import { RoutePath } from "@/lib/routes";

describe("RoutePath", () => {
  it("should have a path for ROOT", () => {
    expect(RoutePath.ROOT).toBe("/");
  });
});
