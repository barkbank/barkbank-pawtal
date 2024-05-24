import { CODE } from "@/lib/utilities/bark-code";
import { withService } from "./_service";
import { givenDog, givenVet } from "./_given";

describe("addAppointment", () => {
  it("should return ERROR_DOG_NOT_FOUND when specified dog cannot be found", async () => {
    await withService(async ({ service }) => {
      const dogId = "12345";
      const vetId = "67890";
      const { result, error } = await service.addAppointment({ dogId, vetId });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
  it("should return ERROR_VET_NOT_FOUND when specified vet cannot be found", async () => {
    await withService(async ({ service, context }) => {
      const { dogId } = await givenDog(context);
      const vetId = "67890";
      const { result, error } = await service.addAppointment({ dogId, vetId });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_VET_NOT_FOUND);
    });
  });
  it("should return ERROR_NOT_PREFERRED_VET when specified vet not preferred vet of the specified dog", async () => {
    await withService(async ({ service, context }) => {
      const { dogId } = await givenDog(context);
      const { vetId } = await givenVet(context);
      const { result, error } = await service.addAppointment({ dogId, vetId });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_NOT_PREFERRED_VET);
    });
  });
});
