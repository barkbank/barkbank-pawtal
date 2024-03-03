import { RoutePath } from "@/lib/route-path";

describe("RoutePath", () => {
  it("should have a path for ROOT", () => {
    expect(RoutePath.ROOT).toBe("/");
  });
  it("should have a path for USER_VIEW_DOG(dogId)", () => {
    expect(RoutePath.USER_VIEW_DOG("123")).toBe("/user/dogs/123");
  });
  it("should have a path for USER_EDIT_DOG(dogId)", () => {
    expect(RoutePath.USER_EDIT_DOG("123")).toBe("/user/dogs/123/edit");
  });
});
