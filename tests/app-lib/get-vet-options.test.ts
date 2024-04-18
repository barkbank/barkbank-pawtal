import { VetOption, getVetOptions } from "@/app/_lib/get-vet-options";
import { withDb } from "../_db_helpers";
import { getVetSpec } from "../_fixtures";
import { dbInsertVet } from "@/lib/data/db-vets";

describe("getVetOptions", () => {
  it("should return an empty list when there are no vets in the database", async () => {
    await withDb(async (dbPool) => {
      const options: VetOption[] = await getVetOptions(dbPool);
      expect(options).toEqual([]);
    });
  });
  it("should return vet options in order of vet name", async () => {
    await withDb(async (dbPool) => {
      const spec1 = getVetSpec(1, {
        vetName: "Roban Pet House",
        vetAddress: "56 Towns Rd, Singapore 555111",
      });
      const spec2 = getVetSpec(2, {
        vetName: "Aero Vet",
        vetAddress: "81 Airport Drive, Singapore 991199",
      });
      const gen1 = await dbInsertVet(dbPool, spec1);
      const gen2 = await dbInsertVet(dbPool, spec2);
      const options: VetOption[] = await getVetOptions(dbPool);
      const expected: VetOption[] = [
        {
          vetId: gen2.vetId,
          vetName: spec2.vetName,
          vetAddress: spec2.vetAddress,
        },
        {
          vetId: gen1.vetId,
          vetName: spec1.vetName,
          vetAddress: spec1.vetAddress,
        },
      ];
      expect(options).toEqual(expected);
    });
  });
});
