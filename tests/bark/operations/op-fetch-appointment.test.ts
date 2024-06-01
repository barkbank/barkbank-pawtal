import { opFetchAppointment } from "@/lib/bark/operations/op-fetch-appointment";
import { withBarkContext } from "../_context";
import { CODE } from "@/lib/utilities/bark-code";
import { givenAppointment } from "../_given";

describe("opFetchAppointment", () => {
  it("should return ERROR_APPOINTMENT_NOT_FOUND when specified appointment does not exist", async () => {
    await withBarkContext(async ({ context }) => {
      const appointmentId = "123";
      const { result, error } = await opFetchAppointment(context, {
        appointmentId,
      });
      expect(error).toEqual(CODE.ERROR_APPOINTMENT_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
  it("should return appointment", async () => {
    await withBarkContext(async ({ context }) => {
      const { appointmentId, dogId, vetId, dogName, dogBreed, dogGender } =
        await givenAppointment(context);
      const { result, error } = await opFetchAppointment(context, {
        appointmentId,
      });
      expect(error).toBeUndefined();
      expect(result).not.toBeUndefined();
      const { appointment } = result!;
      expect(appointment.appointmentId).toEqual(appointmentId);
      expect(appointment.dogId).toEqual(dogId);
      expect(appointment.vetId).toEqual(vetId);
      expect(appointment.dogName).toEqual(dogName);
      expect(appointment.dogBreed).toEqual(dogBreed);
      expect(appointment.dogGender).toEqual(dogGender);
    });
  });
});
