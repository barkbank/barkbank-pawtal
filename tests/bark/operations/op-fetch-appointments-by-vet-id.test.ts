import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { withBarkContext } from "../_context";
import { givenDog, givenVet } from "../_given";
import { opFetchAppointmentsByVetId } from "@/lib/bark/operations/op-fetch-appointments-by-vet-id";

describe("opFetchAppointmentsByVetId", () => {
  it("it should return the appointments scheduled with the specified vet", async () => {
    await withBarkContext(async ({ context, testContext }) => {
      const v1 = await givenVet(testContext, { vetIdx: 1 });
      const v2 = await givenVet(testContext, { vetIdx: 2 });
      const v3 = await givenVet(testContext, { vetIdx: 3 });

      const d1 = await givenDog(testContext, {
        dogIdx: 1,
        preferredVetId: v1.vetId,
      });
      const d2 = await givenDog(testContext, {
        dogIdx: 2,
        preferredVetId: v2.vetId,
      });
      const a1 = await opRecordAppointmentCallOutcome(context, {
        dogId: d1.dogId,
        vetId: v1.vetId,
      });
      const a2 = await opRecordAppointmentCallOutcome(context, {
        dogId: d2.dogId,
        vetId: v2.vetId,
      });
      const l1 = await opFetchAppointmentsByVetId(context, { vetId: v1.vetId });
      const l2 = await opFetchAppointmentsByVetId(context, { vetId: v2.vetId });
      const l3 = await opFetchAppointmentsByVetId(context, { vetId: v3.vetId });

      expect(l3.result!.appointments).toEqual([]);

      expect(l1.result!.appointments.length).toEqual(1);
      expect(l1.result!.appointments[0].appointmentId).toEqual(
        a1.result!.appointmentId,
      );
      expect(l1.result!.appointments[0].dogName).toEqual(d1.dogName);
      expect(l1.result!.appointments[0].dogBreed).toEqual(d1.dogBreed);
      expect(l1.result!.appointments[0].dogGender).toEqual(d1.dogGender);

      expect(l2.result!.appointments.length).toEqual(1);
      expect(l2.result!.appointments[0].appointmentId).toEqual(
        a2.result!.appointmentId,
      );
      expect(l2.result!.appointments[0].dogName).toEqual(d2.dogName);
      expect(l2.result!.appointments[0].dogBreed).toEqual(d2.dogBreed);
      expect(l2.result!.appointments[0].dogGender).toEqual(d2.dogGender);
    });
  });
});
