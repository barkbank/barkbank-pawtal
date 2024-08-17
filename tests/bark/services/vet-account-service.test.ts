import { VetAccountService } from "@/lib/bark/services/vet-account-service";
import { withBarkContext } from "../_context";
import { givenVet } from "../_given";
import { sortBy } from "lodash";

describe("VetAccountService", () => {
  describe("getVetClinics", () => {
    it("returns vet clinics", async () => {
      await withBarkContext(async ({ context }) => {
        const v1 = await givenVet(context, { vetIdx: 11 });
        const v2 = await givenVet(context, { vetIdx: 2 });
        const service = new VetAccountService({ context });
        const { result, error } = await service.getVetClinics();
        expect(error).toBeUndefined();
        const { clinics } = result!;
        expect(clinics.length).toEqual(2);
        const sortedVets = sortBy([v1, v2], (v) => v.vetName);
        expect(clinics[0].vetName).toEqual(sortedVets[0].vetName);
        expect(clinics[1].vetName).toEqual(sortedVets[1].vetName);
      });
    });
  });
});
