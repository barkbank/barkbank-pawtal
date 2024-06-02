import { opCancelAppointment } from "@/lib/bark/operations/op-cancel-appointment";
import { withBarkContext } from "../_context";
import { givenAppointment, givenVet } from "../_given";
import { CODE } from "@/lib/utilities/bark-code";
import { opFetchAppointment } from "@/lib/bark/operations/op-fetch-appointment";
import { APPOINTMENT_STATUS } from "@/lib/bark/models/appointment-status";

describe("opCancelAppointment", () => {
  it("should return ERROR_APPOINTMENT_NOT_FOUND when the appointment does not exist", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context);
      const appointmentId = "123";
      const res = await opCancelAppointment(context, {
        appointmentId,
        actorVetId: vetId,
      });
      expect(res).toEqual(CODE.ERROR_APPOINTMENT_NOT_FOUND);
    });
  });
  it("should return ERROR_NOT_ALLOWED when the actorVetId is not the vet of the appointment", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId: actorVetId } = await givenVet(context, { vetIdx: 1 });
      const { appointmentId, vetId: otherVetId } = await givenAppointment(
        context,
        { idx: 123 },
      );
      expect(otherVetId).not.toEqual(actorVetId);
      const res = await opCancelAppointment(context, {
        appointmentId,
        actorVetId,
      });
      expect(res).toEqual(CODE.ERROR_NOT_ALLOWED);
    });
  });
  it("should cancel the appointment", async () => {
    await withBarkContext(async ({ context }) => {
      const { appointmentId, vetId: actorVetId } = await givenAppointment(
        context,
        { idx: 777 },
      );
      const res = await opCancelAppointment(context, {
        appointmentId,
        actorVetId,
      });
      expect(res).toEqual(CODE.OK);
      const { result } = await opFetchAppointment(context, { appointmentId });
      const { appointment } = result!;
      expect(appointment.appointmentStatus).toEqual(
        APPOINTMENT_STATUS.CANCELLED,
      );
    });
  });
});
