import { getVetFormOptions } from "@/app/_lib/get-vet-form-options";
import { withDb } from "../_db_helpers";
import { getVetSpec } from "../_fixtures";
import { dbInsertVet } from "@/lib/data/db-vets";
import { BarkFormOption } from "@/components/bark/bark-form-option";

describe("getVetFormOptions", () => {
  it("should return empty list when there are no vets in the database", async () => {
    await withDb(async (dbPool) => {
      const options: BarkFormOption[] = await getVetFormOptions(dbPool);
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
      const options: BarkFormOption[] = await getVetFormOptions(dbPool);
      const expected: BarkFormOption[] = [
        {
          value: "",
          label: "None",
          description: "Do not contact me about this dog",
        },
        {
          value: gen2.vetId,
          label: spec2.vetName,
          description: spec2.vetAddress,
        },
        {
          value: gen1.vetId,
          label: spec1.vetName,
          description: spec1.vetAddress,
        },
      ];
      expect(options).toEqual(expected);
    });
  });
});
