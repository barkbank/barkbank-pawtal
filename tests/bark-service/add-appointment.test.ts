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
  it("should return appointment id", async () => {
    await withService(async ({ service, context }) => {
      const { vetId } = await givenVet(context);
      const { dogId } = await givenDog(context, { preferredVetId: vetId });
      const { result, error } = await service.addAppointment({ dogId, vetId });
      expect(result).not.toBeUndefined();
      expect(error).toBeUndefined();
      const { appointmentId } = result!;
      expect(appointmentId).toBeTruthy();
    });
  });
  it("should return ERROR_APPOINTMENT_ALREADY_EXISTS when appointment already exists", async () => {
    await withService(async ({ service, context }) => {
      const { vetId } = await givenVet(context);
      const { dogId } = await givenDog(context, { preferredVetId: vetId });
      // Make first appointment
      await service.addAppointment({ dogId, vetId });

      // Second appointment should get error.
      const { result, error } = await service.addAppointment({ dogId, vetId });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_APPOINTMENT_ALREADY_EXISTS);
    });
  });
});
