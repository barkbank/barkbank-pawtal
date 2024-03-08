import { VetActorFactory } from "@/lib/vet/vet-actor-factory";
import { withDb } from "./_db_helpers";
import { insertVet, getVetActorFactoryConfig, getVetSpec } from "./_fixtures";

describe("VetActorFactory", () => {
  describe("getVetActor", () => {
    it("should load the VetActor for the corresponding email", async () => {
      await withDb(async (db) => {
        const vet = await insertVet(1, db);
        const factory = new VetActorFactory(getVetActorFactoryConfig(db));
        const spec = getVetSpec(1);
        const actor = await factory.getVetActor(spec.vetEmail);
        expect(actor?.getVetId()).toEqual(vet.vetId);
      });
    });
  });
});
