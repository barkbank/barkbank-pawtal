import { withBarkContext } from "../_context";
import { givenAppointment, givenVet } from "../_given";
import { opFetchPendingAppointmentsByVetId } from "@/lib/bark/operations/op-fetch-pending-appointments-by-vet-id";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { mockReportData } from "../_mocks";
import { opCancelAppointment } from "@/lib/bark/operations/op-cancel-appointment";

describe("opFetchPendingAppointmentsByVetId", () => {
  it("should return empty when vet has no appointments", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context);
      const { result, error } = await opFetchPendingAppointmentsByVetId(
        context,
        { vetId },
      );
      expect(error).toBeUndefined();
      const { appointments } = result!;
      expect(appointments).toEqual([]);
    });
  });

  it("should return the vet's appointments, not that of others", async () => {
    await withBarkContext(async ({ context }) => {
      // Given vet with appointment
      const { appointmentId, vetId } = await givenAppointment(context, {
        idx: 123,
      });

      // And appointments for other vets
      await givenAppointment(context, { idx: 801 });
      await givenAppointment(context, { idx: 802 });

      // When the vet retrieves their appointments
      const { result, error } = await opFetchPendingAppointmentsByVetId(
        context,
        { vetId },
      );

      // THEN
      expect(error).toBeUndefined();
      const { appointments } = result!;
      expect(appointments.length).toEqual(1);
      expect(appointments[0].appointmentId).toEqual(appointmentId);
    });
  });

  it("should only return PENDING appointments, not REPORTED or CANCELLED", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context, { vetIdx: 888 });
      const a1 = await givenAppointment(context, {
        idx: 1,
        existingVetId: vetId,
      });
      const a2 = await givenAppointment(context, {
        idx: 2,
        existingVetId: vetId,
      });
      const a3 = await givenAppointment(context, {
        idx: 3,
        existingVetId: vetId,
      });

      const res1 = await opSubmitReport(context, {
        appointmentId: a1.appointmentId,
        actorVetId: vetId,
        reportData: mockReportData(),
      });

      const res2 = await opCancelAppointment(context, {
        appointmentId: a2.appointmentId,
        actorVetId: vetId,
      });

      const res3 = await opFetchPendingAppointmentsByVetId(context, { vetId });
      const { appointments } = res3.result!;
      expect(appointments.length).toEqual(1);
      expect(appointments[0].appointmentId).toEqual(a3.appointmentId);
    });
  });

  it("it should return appointment details", async () => {
    await withBarkContext(async ({ context }) => {
      const { appointmentId, dogId, vetId, dogName, dogBreed, dogGender } =
        await givenAppointment(context, { idx: 888 });
      const { result, error } = await opFetchPendingAppointmentsByVetId(
        context,
        { vetId },
      );
      expect(error).toBeUndefined();
      const { appointments } = result!;
      expect(appointments.length).toEqual(1);
      expect(appointments[0].appointmentId).toEqual(appointmentId);
      expect(appointments[0].dogId).toEqual(dogId);
      expect(appointments[0].dogName).toEqual(dogName);
      expect(appointments[0].dogBreed).toEqual(dogBreed);
      expect(appointments[0].dogGender).toEqual(dogGender);
    });
  });
});
