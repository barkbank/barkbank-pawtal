import { withDb } from "../_db_helpers";
import { insertVet, getVetSpec, getVetActorFactory } from "../_fixtures";

describe("VetActorFactory", () => {
  describe("getVetActor", () => {
    it("should load the VetActor for the corresponding email", async () => {
      await withDb(async (db) => {
        const vet = await insertVet(1, db);
        const factory = getVetActorFactory(db);
        const spec = getVetSpec(1);
        const actor = await factory.getVetActor(spec.vetEmail);
        expect(actor?.getVetId()).toEqual(vet.vetId);
      });
    });
  });
});
