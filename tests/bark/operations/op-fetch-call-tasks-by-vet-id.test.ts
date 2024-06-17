import { opFetchCallTasksByVetId } from "@/lib/bark/operations/op-fetch-call-tasks-by-vet-id";
import { withBarkContext } from "../_context";
import { givenDog, givenReport, givenUser, givenVet } from "../_given";
import { weeksAgo } from "../../_time_helpers";
import { insertCall } from "../../_fixtures";
import { CALL_OUTCOME } from "@/lib/bark/enums/call-outcome";

describe("opFetchCallTasksByVetId", () => {
  it("should return empty list when vet has no applicable call tasks", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context);
      const { result, error } = await opFetchCallTasksByVetId(context, {
        vetId,
      });
      expect(error).toBeUndefined();
      expect(result).toEqual({ callTasks: [] });
    });
  });
  it("should return list of call tasks", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context);
      const d1 = await givenDog(context, { dogIdx: 1, preferredVetId: vetId });
      const d2 = await givenDog(context, { dogIdx: 2, preferredVetId: vetId });
      const { result, error } = await opFetchCallTasksByVetId(context, {
        vetId,
      });
      expect(error).toBeUndefined();
      const { callTasks } = result!;
      expect(callTasks.map((x) => x.dogId).toSorted()).toEqual(
        [d1.dogId, d2.dogId].toSorted(),
      );
    });
  });
  it("should exclude call task of another vet", async () => {
    await withBarkContext(async ({ context }) => {
      const v1 = await givenVet(context, { vetIdx: 1 });
      const v2 = await givenVet(context, { vetIdx: 2 });
      const d1 = await givenDog(context, {
        dogIdx: 1,
        preferredVetId: v1.vetId,
      });
      const d2 = await givenDog(context, {
        dogIdx: 2,
        preferredVetId: v2.vetId,
      });
      const { result, error } = await opFetchCallTasksByVetId(context, {
        vetId: v1.vetId,
      });
      expect(error).toBeUndefined();
      const { callTasks } = result!;
      expect(callTasks.length).toEqual(1);
      expect(callTasks[0].dogId).toEqual(d1.dogId);
    });
  });
  it("should use latest values in call task", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenReport(context, {
        idx: 1,

        // GIVEN a dog profile modified by the user 10 weeks ago that indicates
        // weight to be 30 KG;
        dogProfileModificationTime: weeksAgo(10),
        dogOverrides: {
          dogWeightKg: 30,
        },

        // AND a report 1 week ago that says the weight is 28 KG; AND there was
        // no blood donation (so still eligible)
        reportOverrides: {
          visitTime: weeksAgo(1),
          dogDidDonateBlood: false,
          dogWeightKg: 28,
        },
      });

      // WHEN call tasks are fetched...
      const { result, error } = await opFetchCallTasksByVetId(context, {
        vetId,
      });

      // THEN...
      expect(error).toBeUndefined();
      const { callTasks } = result!;
      expect(callTasks[0].dogWeightKg).toEqual(28);
    });
  });
  it("should exclude dog profile that is incomplete", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context);
      await givenDog(context, {
        dogIdx: 1,
        preferredVetId: vetId,
        dogOverrides: { dogBreed: "", dogWeightKg: null },
      });
      const { result, error } = await opFetchCallTasksByVetId(context, {
        vetId,
      });
      expect(error).toBeUndefined();
      expect(result).toEqual({ callTasks: [] });
    });
  });
  it("should return null last contacted times when vet has never contacted the owner", async () => {
    await withBarkContext(async ({ context }) => {
      // Given vets v1 and v2
      const v1 = await givenVet(context, { vetIdx: 1 });
      const v2 = await givenVet(context, { vetIdx: 2 });

      // And dog d1 with preferred vet v1
      const d1 = await givenDog(context, {
        dogIdx: 1,
        preferredVetId: v1.vetId,
      });

      // And a previous call from v2 to d1's owner
      const c1 = await insertCall(
        context.dbPool,
        d1.dogId,
        v2.vetId,
        CALL_OUTCOME.DECLINED,
      );

      // When call task is fetched
      const { result, error } = await opFetchCallTasksByVetId(context, {
        vetId: v1.vetId,
      });

      // Then...
      expect(error).toBeUndefined();

      // The last contacted times should both be null
      expect(result?.callTasks[0].dogLastContactedTime).toBeNull();
      expect(result?.callTasks[0].ownerLastContactedTime).toBeNull();
    });
  });
  it("should use last contact times from the POV of the actor vet", async () => {
    await withBarkContext(async ({ context }) => {
      // Given vet v1
      const v1 = await givenVet(context, { vetIdx: 1 });

      // And user u1 owning dogs d1 and d2 that both prefer vet v1
      const u1 = await givenUser(context, { userIdx: 1 });
      const d1 = await givenDog(context, {
        dogIdx: 1,
        preferredVetId: v1.vetId,
        userId: u1.userId,
      });
      const d2 = await givenDog(context, {
        dogIdx: 2,
        preferredVetId: v1.vetId,
        userId: u1.userId,
      });

      // And v1 has contacted the owner about dog d1
      const c1 = await insertCall(
        context.dbPool,
        d1.dogId,
        v1.vetId,
        CALL_OUTCOME.DECLINED,
      );

      // And there is a later call from vet v2
      const v2 = await givenVet(context, { vetIdx: 2 });
      const c2 = await insertCall(
        context.dbPool,
        d1.dogId,
        v2.vetId,
        CALL_OUTCOME.DECLINED,
      );

      // When call tasks are fetched
      const { result, error } = await opFetchCallTasksByVetId(context, {
        vetId: v1.vetId,
      });

      // Then...
      expect(error).toBeUndefined();
      const t1 = result!.callTasks.filter(
        (task) => task.dogName === d1.dogName,
      )[0];
      const t2 = result!.callTasks.filter(
        (task) => task.dogName === d2.dogName,
      )[0];

      console.debug({ c1, c2, t1, t2 });
      expect(t1.ownerLastContactedTime).toEqual(c1.callCreationTime);
      expect(t1.dogLastContactedTime).toEqual(c1.callCreationTime);
      expect(t2.ownerLastContactedTime).toEqual(c1.callCreationTime);
      expect(t2.dogLastContactedTime).toBeNull();
    });
  });
});
