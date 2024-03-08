import {
  dbInsertVet,
  dbSelectVet,
  dbSelectVetIdByEmail,
} from "@/lib/data/db-vets";
import { withDb } from "../_db_helpers";
import { guaranteed } from "@/lib/bark-utils";
import { getVetMapper, getVetSpec } from "../_fixtures";

describe("db-vets", () => {
  describe("dbInsertVet", () => {
    it("should return VetGen", async () => {
      await withDb(async (db) => {
        const specIn = getVetSpec(1);
        const vetGen = await dbInsertVet(db, specIn);
        expect(vetGen.vetCreationTime).toBeTruthy();
        expect(vetGen.vetModificationTime).toBeTruthy();
        expect(vetGen.vetModificationTime).toEqual(vetGen.vetCreationTime);
      });
    });
  });
  describe("dbSelectVet", () => {
    it("should return vet matching the vetId", async () => {
      await withDb(async (db) => {
        const specIn = getVetSpec(6);
        const vetGen = await dbInsertVet(db, specIn);
        const vet = await dbSelectVet(db, vetGen.vetId);
        expect(vet).not.toBeNull();
        expect(vet?.vetCreationTime).toBeTruthy();
        expect(vet?.vetModificationTime).toBeTruthy();
        expect(vet?.vetModificationTime).toEqual(vet?.vetCreationTime);
        const mapper = getVetMapper();
        const specOut = mapper.mapVetToVetSpec(guaranteed(vet));
        expect(specOut).toMatchObject(specIn);
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
        const specIn = getVetSpec(8);
        const vetGen = await dbInsertVet(db, specIn);
        const vetId = await dbSelectVetIdByEmail(db, specIn.vetEmail);
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
