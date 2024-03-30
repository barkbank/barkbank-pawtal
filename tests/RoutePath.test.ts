import { AccountType } from "@/lib/auth-models";
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

  describe("ACCOUNT_DASHBOARD ", () => {
    it("should have a path for ADMIN accounts", () => {
      expect(RoutePath.ACCOUNT_DASHBOARD(AccountType.ADMIN)).toBe(
        RoutePath.ADMIN_DASHBOARD_PAGE,
      );
    });
    it("should have a path for VET accounts", () => {
      expect(RoutePath.ACCOUNT_DASHBOARD(AccountType.VET)).toBe(
        RoutePath.VET_DASHBOARD_PAGE,
      );
    });
    it("should have a path for USER accounts", () => {
      expect(RoutePath.ACCOUNT_DASHBOARD(AccountType.USER)).toBe(
        RoutePath.USER_DEFAULT_LOGGED_IN_PAGE,
      );
    });
    it("should default to root when undefined", () => {
      expect(RoutePath.ACCOUNT_DASHBOARD(undefined)).toBe(RoutePath.ROOT);
    });
  });
});
