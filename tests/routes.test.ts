import { RoutePath } from "@/lib/route-path";

describe("RoutePath", () => {
  it("should have a path for ROOT", () => {
    expect(RoutePath.ROOT).toBe("/");
  });
});
