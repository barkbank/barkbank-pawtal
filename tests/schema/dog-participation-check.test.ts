import { dbUpdateDogParticipation } from "@/lib/data/db-dogs";
import { withDb } from "../_db_helpers";
import { getTextEncryptionService, insertDog, insertUser } from "../_fixtures";
import { PARTICIPATION_STATUS } from "@/lib/bark/enums/participation-status";
import { expectError, expectSuccess } from "../_helpers";
import { MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";

describe("dog_participation_check", () => {
  it("should not allow PARTICIPATING with expiry time", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(1, userId, dbPool);
      await expectError(async () => {
        await dbUpdateDogParticipation(dbPool, dogId, {
          participationStatus: PARTICIPATION_STATUS.PARTICIPATING,
          pauseExpiryTime: nextWeek(),
        });
      });
    });
  });
  it("should not allow PARTICIPATING with reason", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(1, userId, dbPool);
      await expectError(async () => {
        await dbUpdateDogParticipation(dbPool, dogId, {
          participationStatus: PARTICIPATION_STATUS.PARTICIPATING,
          encryptedReason: await encryptedText("no reason"),
        });
      });
    });
  });
  it("should allow PAUSED with reason", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(1, userId, dbPool);
      await expectSuccess(async () => {
        await dbUpdateDogParticipation(dbPool, dogId, {
          participationStatus: PARTICIPATION_STATUS.PAUSED,
          pauseExpiryTime: nextWeek(),
          encryptedReason: await encryptedText("no reason"),
        });
      });
    });
  });
  it("should allow PAUSED without reason", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(1, userId, dbPool);
      await expectSuccess(async () => {
        await dbUpdateDogParticipation(dbPool, dogId, {
          participationStatus: PARTICIPATION_STATUS.PAUSED,
          pauseExpiryTime: nextWeek(),
        });
      });
    });
  });
  it("should allow OPTED_OUT with reason", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(1, userId, dbPool);
      await expectSuccess(async () => {
        await dbUpdateDogParticipation(dbPool, dogId, {
          participationStatus: PARTICIPATION_STATUS.OPTED_OUT,
          encryptedReason: await encryptedText("no reason"),
        });
      });
    });
  });
  it("should allow OPTED_OUT without reason", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(1, userId, dbPool);
      await expectSuccess(async () => {
        await dbUpdateDogParticipation(dbPool, dogId, {
          participationStatus: PARTICIPATION_STATUS.OPTED_OUT,
        });
      });
    });
  });
  it("should not allow OPTED_OUT expiry time", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(1, userId, dbPool);
      await expectError(async () => {
        await dbUpdateDogParticipation(dbPool, dogId, {
          participationStatus: PARTICIPATION_STATUS.OPTED_OUT,
          pauseExpiryTime: nextWeek(),
        });
      });
    });
  });
});

function nextWeek(): Date {
  return new Date(Date.now() + MILLIS_PER_WEEK);
}

async function encryptedText(text: string): Promise<string> {
  return getTextEncryptionService().getEncryptedData(text);
}
