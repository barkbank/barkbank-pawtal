import { dbInsertUser, dbSelectUser } from "@/lib/data/dbUsers";
import { withDb } from "./_db_helpers";
import { UserPii, encryptUserPii } from "@/lib/user/user-pii";
import { User, UserSpec } from "@/lib/data/models";
import { HarnessEncryptionService, HarnessHashService } from "./_harness";
import { UserActor, UserActorConfig } from "@/lib/user/user-actor";
import { Pool } from "pg";

describe("UserActor", () => {
  it("can retrieve its own actor data from the database", async () => {
    await withDb(async (db) => {
      const user = await createUser(1, db);
      const config = getUserActorConfig(db);
      const actor = new UserActor(user.userId, config);
      const ownUser = await actor.getOwnUser();
      expect(ownUser).toEqual(user);
    });
  });
  it("can retrieve its own PII", async () => {
    await withDb(async (db) => {
      const user = await createUser(1, db);
      const config = getUserActorConfig(db);
      const actor = new UserActor(user.userId, config);
      const ownPii = await actor.getOwnPii();
      expect(ownPii).toEqual(userPii(1));
    });
  });
});

const emailHashService = new HarnessHashService();
const piiEncryptionService = new HarnessEncryptionService();

function getUserActorConfig(db: Pool): UserActorConfig {
  return {
    dbPool: db,
    piiEncryptionService: piiEncryptionService,
  };
}

async function createUser(idx: number, db: Pool): Promise<User> {
  const spec = await userSpec(1);
  const gen = await dbInsertUser(db, spec);
  const user = await dbSelectUser(db, gen.userId);
  if (user === null) {
    fail("Failed to retrieve user");
  }
  return user;
}

async function userSpec(idx: number): Promise<UserSpec> {
  const pii = userPii(idx);
  const userEncryptedPii = await encryptUserPii(pii, piiEncryptionService);
  const userHashedEmail = await emailHashService.getHashHex(pii.userEmail);
  return { userHashedEmail, userEncryptedPii };
}

function userPii(idx: number): UserPii {
  return {
    userEmail: `user${idx}@user.com`,
    userName: `User ${idx}`,
    userPhoneNumber: `+65 ${10000000 + idx}`,
  };
}
