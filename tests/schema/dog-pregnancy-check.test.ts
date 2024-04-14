import { withDb } from "../_db_helpers";
import { insertDog, insertUser } from "../_fixtures";
import { expectError, expectSuccess } from "../_helpers";

describe("dog_pregnancy_check", () => {
  it("should not be able to insert a MALE dog with pregnancy history UNKNOWN", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      await expectError(async () => {
        await insertDog(1, userId, dbPool, {
          dogGender: "MALE",
          dogEverPregnant: "UNKNOWN",
        });
      });
    });
  });

  it("should not be able to insert a MALE dog with pregnancy history YES", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      await expectError(async () => {
        await insertDog(1, userId, dbPool, {
          dogGender: "MALE",
          dogEverPregnant: "YES",
        });
      });
    });
  });

  it("should be able to insert a MALE dog with pregnancy history NO", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      await expectSuccess(async () => {
        await insertDog(1, userId, dbPool, {
          dogGender: "MALE",
          dogEverPregnant: "NO",
        });
      });
    });
  });

  it("should be able to insert a FEMALE dog with pregnancy history UNKNOWN", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      await expectSuccess(async () => {
        await insertDog(1, userId, dbPool, {
          dogGender: "FEMALE",
          dogEverPregnant: "UNKNOWN",
        });
      });
    });
  });

  it("should be able to insert a FEMALE dog with pregnancy history YES", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      await expectSuccess(async () => {
        await insertDog(1, userId, dbPool, {
          dogGender: "FEMALE",
          dogEverPregnant: "YES",
        });
      });
    });
  });

  it("should be able to insert a FEMALE dog with pregnancy history NO", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      await expectSuccess(async () => {
        await insertDog(1, userId, dbPool, {
          dogGender: "FEMALE",
          dogEverPregnant: "NO",
        });
      });
    });
  });
});
