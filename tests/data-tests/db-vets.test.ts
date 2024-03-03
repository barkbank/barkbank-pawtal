import {
  dbInsertVet,
  dbSelectVet,
  dbSelectVetIdByEmail,
} from "@/lib/data/db-vets";
import { withDb } from "../_db_helpers";
import { vetSpec } from "./_db_fixtures";
import { toVetSpec } from "@/lib/data/db-mappers";
import { guaranteed } from "@/lib/bark-utils";

describe("db-vets", () => {
  describe("dbInsertVet", () => {
    it("should return VetGen", async () => {
      await withDb(async (db) => {
        const vetGen = await dbInsertVet(db, vetSpec(1));
        expect(vetGen.vetCreationTime).toBeTruthy();
        expect(vetGen.vetModificationTime).toBeTruthy();
        expect(vetGen.vetModificationTime).toEqual(vetGen.vetCreationTime);
      });
    });
  });
  describe("dbSelectVet", () => {
    it("should return vet matching the vetId", async () => {
      await withDb(async (db) => {
        const vetGen = await dbInsertVet(db, vetSpec(1));
        const vet = await dbSelectVet(db, vetGen.vetId);
        expect(vet).not.toBeNull();
        expect(vet?.vetCreationTime).toBeTruthy();
        expect(vet?.vetModificationTime).toBeTruthy();
        expect(vet?.vetModificationTime).toEqual(vet?.vetCreationTime);
        const spec = toVetSpec(guaranteed(vet));
        expect(spec).toMatchObject(vetSpec(1));
      });
    });
    it("should return null no vet matches the vetId", async () => {
      await withDb(async (db) => {
        const vet = await dbSelectVet(db, "111");
        expect(vet).toBeNull();
      });
    });
  });
  describe("dbSelectVetIdByEmail", () => {
    it("should return vetId matching the email", async () => {
      await withDb(async (db) => {
        const vetGen = await dbInsertVet(db, vetSpec(1));
        const vetId = await dbSelectVetIdByEmail(db, vetSpec(1).vetEmail);
        expect(vetId).toEqual(vetGen.vetId);
      });
    });
    it("should return null when no vet matches the email", async () => {
      await withDb(async (db) => {
        const vetId = await dbSelectVetIdByEmail(db, "notavet@vet.com");
        expect(vetId).toBeNull();
      });
    });
  });
});
