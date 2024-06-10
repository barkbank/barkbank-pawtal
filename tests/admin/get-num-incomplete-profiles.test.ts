import { dbQuery } from "@/lib/data/db-utils";
import { withDb } from "../_db_helpers";
import {
  getAdminActor,
  insertAdmin,
  insertDog,
  insertUser,
} from "../_fixtures";
import { Pool } from "pg";
import { PARTICIPATION_STATUS } from "@/lib/data/db-enums";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no";
import { DOG_GENDER } from "@/lib/bark/models/dog-gender";
import {
  DEFAULT_DATE_TIME_FORMAT,
  SINGAPORE_TIME_ZONE,
  UTC_DATE_OPTION,
  parseDateTime,
} from "@/lib/utilities/bark-time";
import { MILLIS_PER_DAY, MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";
import { dbUpdateDogParticipation } from "@/lib/data/db-dogs";
import { getNumIncompleteProfiles } from "@/lib/admin/actions/get-num-incomplete-profiles";

describe("getNumIncompleteProfiles", () => {
  it("should return ERROR_UNAUTHORIZED when admin does not have donor management permissions", async () => {
    await withDb(async (dbPool) => {
      const { adminId } = await insertAdmin(1, dbPool, {
        adminCanManageDonors: false,
      });
      const actor = getAdminActor(dbPool, adminId);
      const { error } = await getNumIncompleteProfiles(actor);
      expect(error).toEqual("ERROR_UNAUTHORIZED");
    });
  });
  it("should not count profiles that are not INCOMPLETE", async () => {
    await withDb(async (dbPool) => {
      const p1 = await insertIncompleteProfile(1, dbPool);
      const p2 = await insertCompleteProfile(2, dbPool); // <-- complete
      const p3 = await insertIncompleteProfile(3, dbPool);
      const { adminId } = await insertAdmin(1, dbPool, {
        adminCanManageDonors: true,
      });
      const actor = getAdminActor(dbPool, adminId);
      const { result } = await getNumIncompleteProfiles(actor);
      expect(result).toEqual(2);
    });
  });
  it("should not count profiles that are not PARTICIPATING", async () => {
    await withDb(async (dbPool) => {
      const p1 = await insertIncompleteProfile(1, dbPool);
      const p2 = await insertPausedProfile(2, dbPool); // <-- not participating
      const p3 = await insertIncompleteProfile(3, dbPool);
      const { adminId } = await insertAdmin(1, dbPool, {
        adminCanManageDonors: true,
      });
      const actor = getAdminActor(dbPool, adminId);
      const { result } = await getNumIncompleteProfiles(actor);
      expect(result).toEqual(2);
    });
  });
});

async function insertIncompleteProfile(
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string }> {
  const { userId } = await insertUser(idx, dbPool);
  const { dogId } = await insertDog(idx, userId, dbPool, {
    dogGender: DOG_GENDER.MALE,
    dogBirthday: parseDateTime("2020-03-03", UTC_DATE_OPTION),
    dogWeightKg: null,
    dogBreed: "",
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.UNKNOWN,
  });
  await setDogCreationTime(idx, dogId, dbPool);
  return { userId, dogId };
}

async function insertCompleteProfile(
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string }> {
  const { userId } = await insertUser(idx, dbPool);
  const { dogId } = await insertDog(idx, userId, dbPool, {
    dogGender: DOG_GENDER.MALE,
    dogBirthday: parseDateTime("2020-03-03", UTC_DATE_OPTION),
    dogWeightKg: 28,
    dogBreed: "Lion Dog",
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
  });
  await setDogCreationTime(idx, dogId, dbPool);
  return { userId, dogId };
}

async function insertPausedProfile(
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
  const nextWeek = new Date(Date.now() + MILLIS_PER_WEEK);
  await dbUpdateDogParticipation(dbPool, dogId, {
    participationStatus: PARTICIPATION_STATUS.PAUSED,
    pauseExpiryTime: nextWeek,
  });
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
