import { AccountType } from "@/lib/auth";
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
    it("should have a path for ADMIN_DASHBOARD_PAGE", () => {
      expect(RoutePath.ACCOUNT_DASHBOARD(AccountType.ADMIN)).toBe(
        "/admin/dashboard",
      );
    });
    it("should have a path for VET_DASHBOARD_PAGE", () => {
      expect(RoutePath.ACCOUNT_DASHBOARD(AccountType.VET)).toBe(
        "/vet/dashboard",
      );
    });
    it("should have a path for USER_DASHBOARD_PAGE", () => {
      expect(RoutePath.ACCOUNT_DASHBOARD(AccountType.USER)).toBe(
        "/user/dashboard",
      );
    });
    it("should have a path for ROOT", () => {
      expect(RoutePath.ACCOUNT_DASHBOARD("")).toBe("/");
    });
    it("should default to root", () => {
      expect(RoutePath.ACCOUNT_DASHBOARD("UNKNOWN")).toBe("/");
    });
  });
});
