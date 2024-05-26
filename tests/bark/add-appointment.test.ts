import { CODE } from "@/lib/utilities/bark-code";
import { withBarkContext } from "./_service";
import { givenDog, givenVet } from "./_given";
import { BarkAction_addAppointment } from "@/lib/bark/actions/add-appointment";

describe("BarkAction_addAppointment", () => {
  it("should return ERROR_DOG_NOT_FOUND when specified dog cannot be found", async () => {
    await withBarkContext(async ({ context }) => {
      const dogId = "12345";
      const vetId = "67890";
      const { result, error } = await BarkAction_addAppointment(context, {
        dogId,
        vetId,
      });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
  it("should return ERROR_VET_NOT_FOUND when specified vet cannot be found", async () => {
    await withBarkContext(async ({ context, testContext }) => {
      const { dogId } = await givenDog(testContext);
      const vetId = "67890";
      const { result, error } = await BarkAction_addAppointment(context, {
        dogId,
        vetId,
      });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_VET_NOT_FOUND);
    });
  });
  it("should return ERROR_NOT_PREFERRED_VET when specified vet not preferred vet of the specified dog", async () => {
    await withBarkContext(async ({ context, testContext }) => {
      const { dogId } = await givenDog(testContext);
      const { vetId } = await givenVet(testContext);
      const { result, error } = await BarkAction_addAppointment(context, {
        dogId,
        vetId,
      });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_NOT_PREFERRED_VET);
    });
  });
  it("should return appointment id", async () => {
    await withBarkContext(async ({ context, testContext }) => {
      const { vetId } = await givenVet(testContext);
      const { dogId } = await givenDog(testContext, { preferredVetId: vetId });
      const { result, error } = await BarkAction_addAppointment(context, {
        dogId,
        vetId,
      });
      expect(result).not.toBeUndefined();
      expect(error).toBeUndefined();
      const { appointmentId } = result!;
      expect(appointmentId).toBeTruthy();
    });
  });
  it("should return ERROR_APPOINTMENT_ALREADY_EXISTS when appointment already exists", async () => {
    await withBarkContext(async ({ context, testContext }) => {
      const { vetId } = await givenVet(testContext);
      const { dogId } = await givenDog(testContext, { preferredVetId: vetId });
      // Make first appointment
      await BarkAction_addAppointment(context, { dogId, vetId });

      // Second appointment should get error.
      const { result, error } = await BarkAction_addAppointment(context, {
        dogId,
        vetId,
      });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_APPOINTMENT_ALREADY_EXISTS);
    });
  });
});
