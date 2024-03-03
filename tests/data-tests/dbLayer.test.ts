import { withDb } from "../_db_helpers";
import { DogSpec, DogStatus } from "@/lib/data/models";
import {
  toDogSpec,
  toUserSpec,
  toAdminSpec,
  toVetSpec,
} from "@/lib/data/mappers";
import {
  dbDeleteUser,
  dbInsertUser,
  dbSelectUser,
  dbSelectUserIdByHashedEmail,
  dbUpdateUser,
} from "@/lib/data/dbUsers";
import {
  dbDeleteDogVetPreferences,
  dbInsertDog,
  dbInsertDogVetPreference,
  dbSelectDog,
  dbSelectPreferredVetIds,
} from "@/lib/data/dbDogs";
import {
  dbInsertAdmin,
  dbSelectAdmin,
  dbSelectAdminIdByAdminHashedEmail,
} from "@/lib/data/dbAdmins";
import {
  dbInsertVet,
  dbSelectVet,
  dbSelectVetIdByEmail,
} from "@/lib/data/dbVets";
import { guaranteed } from "@/lib/bark-utils";
import { Pool } from "pg";
import {
  userSpec,
  ensureTimePassed,
  dogSpec,
  vetSpec,
  adminSpec,
} from "./_dbFixtures";

/**
 * Database Layer refers to the code in lib/data.
 */
describe("Database Layer", () => {
  describe("models", () => {
    describe("DogStatus enumeration", () => {
      it("is an enumeration of strings", () => {
        expect(DogStatus.NEW_PROFILE).toBe("NEW_PROFILE");
        expect(typeof DogStatus.NEW_PROFILE).toBe("string");
      });
    });
  });
});
