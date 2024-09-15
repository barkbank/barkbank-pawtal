import { CODE } from "@/lib/utilities/bark-code";
import { withBarkContext } from "../_context";
import { givenDog, givenVet } from "../_given";
import { BarkContext } from "@/lib/bark/bark-context";
import {
  SINGAPORE_TIME_ZONE,
  parseCommonDate,
} from "@/lib/utilities/bark-time";
import { dbQuery } from "@/lib/data/db-utils";
import { insertAppointment } from "@/lib/bark/queries/insert-appointment";
import {
  getUserActor,
  givenUserActor,
  mockDogProfileSpec,
} from "../../_fixtures";

// WIP: Move it into tests/user/user-actor-get-dog-appointments.test.ts
describe("UserActor::getDogAppointments", () => {
  it("returns empty list when there are no appointments", async () => {
    await withBarkContext(async ({ context }) => {
      const u1 = await givenUserActor({ idx: 1, context });
      const d1 = (await u1.addDogProfile({ spec: mockDogProfileSpec() }))
        .result!;
      const { result, error } = await u1.getDogAppointments({
        dogId: d1.dogId,
      });
      expect(error).toBeUndefined();
      expect(result).toEqual([]);
    });
  });
  it("returns appointments, newests to oldest, by creation time", async () => {
    await withBarkContext(async ({ context }) => {
      // TODO: Upgrade this test when VetActor can schedule appointments

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
      const a1 = await _addAppointment(context, {
        dogId: d1.dogId,
        vetId: v1.vetId,
        creationTime: parseCommonDate("10 May 2020", SINGAPORE_TIME_ZONE),
      });
      const a2 = await _addAppointment(context, {
        dogId: d1.dogId,
        vetId: v2.vetId,
        creationTime: parseCommonDate("10 May 2021", SINGAPORE_TIME_ZONE),
      });
      const a3 = await _addAppointment(context, {
        dogId: d1.dogId,
        vetId: v2.vetId,
        creationTime: parseCommonDate("10 May 2022", SINGAPORE_TIME_ZONE),
      });

      // When...
      const actor = getUserActor(context.dbPool, d1.ownerUserId);
      const { result, error } = await actor.getDogAppointments({
        dogId: d1.dogId,
      });

      // Then...
      expect(error).toBeUndefined();
      const appointments = result!;
      expect(appointments[0].appointmentId).toEqual(a3.appointmentId);
      expect(appointments[1].appointmentId).toEqual(a2.appointmentId);
      expect(appointments[2].appointmentId).toEqual(a1.appointmentId);
    });
  });
  it("returns ERROR_DOG_NOT_FOUND when dog does not belong to actor", async () => {
    await withBarkContext(async ({ context }) => {
      // Given users u1 and u2
      const u1 = await givenUserActor({ idx: 1, context });
      const u2 = await givenUserActor({ idx: 2, context });

      // And dog d1 belonging to u1
      const d1 = (await u1.addDogProfile({ spec: mockDogProfileSpec() }))
        .result!;

      // When u2 requests for appointments of d1
      const { result, error } = await u2.getDogAppointments({
        dogId: d1.dogId,
      });

      // Then...
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
  it("returns ERROR_DOG_NOT_FOUND when dog not found", async () => {
    await withBarkContext(async ({ context }) => {
      const u1 = await givenUserActor({ idx: 1, context });
      const dogId = "12345";
      const { result, error } = await u1.getDogAppointments({ dogId });
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
});

// TODO: Remove this when the test adds appointments using vet actor
async function _addAppointment(
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
