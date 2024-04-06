import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { withDb } from "../_db_helpers";
import {
  getAdminActor,
  insertAdmin,
  insertDog,
  insertUser,
} from "../_fixtures";
import { getIncompleteProfiles } from "@/lib/admin/actions/get-incomplete-profiles";
import { Pool } from "pg";
import { YES_NO_UNKNOWN } from "@/lib/data/db-enums";
import {
  DEFAULT_DATE_TIME_FORMAT,
  SINGAPORE_TIME_ZONE,
  parseDateTime,
} from "@/lib/utilities/bark-time";
import { MILLIS_PER_DAY } from "@/lib/utilities/bark-millis";
import { guaranteed } from "@/lib/utilities/bark-utils";

describe("getIncompleteProfiles", () => {
  it("should return ERROR_UNAUTHORIZED when admin does not have donor management permissions", async () => {
    await withDb(async (dbPool) => {
      const { adminId } = await insertAdmin(1, dbPool, {
        adminCanManageDonors: false,
      });
      const actor = getAdminActor(dbPool, adminId);
      const { error } = await getIncompleteProfiles(actor, {
        offset: 0,
        limit: 99,
      });
      expect(error).toEqual("ERROR_UNAUTHORIZED");
    });
  });
  it("should order profiles by creation time, oldest first", async () => {
    await withDb(async (dbPool) => {
      const p1 = await insertIncompleteProfile(1, dbPool);
      const p2 = await insertIncompleteProfile(2, dbPool);
      const p3 = await insertIncompleteProfile(3, dbPool);
      const { adminId } = await insertAdmin(1, dbPool, {
        adminCanManageDonors: true,
      });
      const actor = getAdminActor(dbPool, adminId);
      const { result } = await getIncompleteProfiles(actor, {
        offset: 0,
        limit: 99,
      });
      expect(result !== undefined).toBe(true);
      const profiles = guaranteed(result);
      expect(profiles.length).toEqual(3);
      expect(profiles[0].dogId).toEqual(p1.dogId);
      expect(profiles[1].dogId).toEqual(p2.dogId);
      expect(profiles[2].dogId).toEqual(p3.dogId);
    });
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
  it("should only exclude profiles that are not PARTICIPATING", async () => {
    await withDb(async (dbPool) => {});
  });
});

async function insertIncompleteProfile(
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string }> {
  const { userId } = await insertUser(idx, dbPool);
  const { dogId } = await insertDog(idx, userId, dbPool, {
    dogWeightKg: null,
    dogBreed: "",
    dogEverPregnant: YES_NO_UNKNOWN.UNKNOWN,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.UNKNOWN,
  });
  await setDogCreationTime(idx, dogId, dbPool);
  return { userId, dogId };
}

async function setDogCreationTime(idx: number, dogId: string, dbPool: Pool) {
  const baseTs = parseDateTime("2023-01-01 08:00", {
    format: DEFAULT_DATE_TIME_FORMAT,
    timeZone: SINGAPORE_TIME_ZONE,
  }).getTime();
  const dogCreationTime = new Date(baseTs + idx * MILLIS_PER_DAY);
  const sql = `
  update dogs
  set dog_creation_time = $2
  where dog_id = $1
  returning 1
  `;
  const res = await dbQuery(dbPool, sql, [dogId, dogCreationTime]);
  expect(res.rows.length).toEqual(1);
}
