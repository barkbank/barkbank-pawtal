import { CODE } from "@/lib/utilities/bark-code";
import { withBarkContext } from "../_context";
import { opFetchDogAppointmentsByDogId } from "@/lib/bark/operations/op-fetch-dog-appointments-by-dog-id";
import { givenDog, givenUser, givenVet } from "../_given";
import { BarkContext } from "@/lib/bark/bark-context";
import {
  SINGAPORE_TIME_ZONE,
  parseCommonDate,
} from "@/lib/utilities/bark-time";
import { dbQuery } from "@/lib/data/db-utils";
import { insertAppointment } from "@/lib/bark/queries/insert-appointment";

describe("opFetchDogAppointmentsByDogId", () => {
  it("returns empty list when there are no appointments", async () => {
    await withBarkContext(async ({ context }) => {
      const { dogId } = await givenDog(context);
      const { result, error } = await opFetchDogAppointmentsByDogId(context, {
        dogId,
      });
      expect(error).toBeUndefined();
      expect(result).toEqual({ appointments: [] });
    });
  });
  it("returns appointments, newests to oldest, by creation time", async () => {
    await withBarkContext(async ({ context }) => {
      // Given vet v1 and dog d1
      const v1 = await givenVet(context, { vetIdx: 1 });
      const d1 = await givenDog(context, {
        dogIdx: 1,
        preferredVetId: v1.vetId,
      });

      // And two more vets
      const v2 = await givenVet(context, { vetIdx: 2 });
      const v3 = await givenVet(context, { vetIdx: 3 });

      // And appointments a1, a2, a3, in that order, vets v1, v2, and v3.
      const a1 = await addAppointment(context, {
        dogId: d1.dogId,
        vetId: v1.vetId,
        creationTime: parseCommonDate("10 May 2020", SINGAPORE_TIME_ZONE),
      });
      const a2 = await addAppointment(context, {
        dogId: d1.dogId,
        vetId: v2.vetId,
        creationTime: parseCommonDate("10 May 2021", SINGAPORE_TIME_ZONE),
      });
      const a3 = await addAppointment(context, {
        dogId: d1.dogId,
        vetId: v2.vetId,
        creationTime: parseCommonDate("10 May 2022", SINGAPORE_TIME_ZONE),
      });

      // When...
      const { result, error } = await opFetchDogAppointmentsByDogId(context, {
        dogId: d1.dogId,
      });

      // Then...
      expect(error).toBeUndefined();
      const { appointments } = result!;
      expect(appointments[0].appointmentId).toEqual(a3.appointmentId);
      expect(appointments[1].appointmentId).toEqual(a2.appointmentId);
      expect(appointments[2].appointmentId).toEqual(a1.appointmentId);
    });
  });
  it("returns ERROR_WRONG_OWNER when actorUserId is not the dog owner", async () => {
    await withBarkContext(async ({ context }) => {
      // Given users u1 and u2
      const u1 = await givenUser(context, { userIdx: 1 });
      const u2 = await givenUser(context, { userIdx: 2 });

      // And dog d1 belonging to u1
      const d1 = await givenDog(context, { dogIdx: 1, userId: u1.userId });

      // When u2 requests for appointments of d1
      const { result, error } = await opFetchDogAppointmentsByDogId(context, {
        dogId: d1.dogId,
        actorUserId: u2.userId,
      });

      // Then...
      expect(error).toEqual(CODE.ERROR_WRONG_OWNER);
      expect(result).toBeUndefined();
    });
  });
  it("returns ERROR_DOG_NOT_FOUND when dog not found", async () => {
    await withBarkContext(async ({ context }) => {
      const dogId = "12345";
      const { result, error } = await opFetchDogAppointmentsByDogId(context, {
        dogId,
      });
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
});

async function addAppointment(
  context: BarkContext,
  args: {
    dogId: string;
    vetId: string;
    creationTime: Date;
  },
): Promise<{ appointmentId: string }> {
  const { dbPool } = context;
  const { vetId, dogId, creationTime } = args;
  const { appointmentId } = await insertAppointment(dbPool, { dogId, vetId });
  const sql = `
  UPDATE calls
  SET call_creation_time = $2
  WHERE call_id = $1
  `;
  const res2 = await dbQuery(dbPool, sql, [appointmentId, creationTime]);
  return { appointmentId };
}
