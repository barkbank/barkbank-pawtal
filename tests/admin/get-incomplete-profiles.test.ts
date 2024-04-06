import { withDb } from "../_db_helpers";
import { getAdminActor, insertAdmin } from "../_fixtures";
import { getIncompleteProfiles } from "@/lib/admin/actions/get-incomplete-profiles";

describe("getIncompleteProfiles", () => {
  it("should return ERROR_UNAUTHORIZED when admin does not have donor management permissions", async () => {
    await withDb(async (dbPool) => {
      const { adminId } = await insertAdmin(1, dbPool);
      const actor = getAdminActor(dbPool, adminId);
      const { error } = await getIncompleteProfiles(actor, {
        offset: 0,
        limit: 99,
      });
      expect(error).toEqual("ERROR_UNAUTHORIZED");
    });
  });
  it("should order profiles by creation time, latest first", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should limit number of profiles returned by the specified amount", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should return profiles starting from the specified offset", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should only return profiles with profile status INCOMPLETE", async () => {
    await withDb(async (dbPool) => {});
  });
});
