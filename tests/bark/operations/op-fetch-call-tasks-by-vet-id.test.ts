import { opFetchCallTasksByVetId } from "@/lib/bark/operations/op-fetch-call-tasks-by-vet-id";
import { withBarkContext } from "../_context";
import { givenDog, givenReport, givenVet } from "../_given";
import { weeksAgo } from "../../_time_helpers";

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
  it("WIP: both last contacted times should be null when vet has never contacted the owner", async () => {
    await withBarkContext(async ({context}) => {
      // Given vets v1 and v2
      // And dog d1 with preferred vet v1
      // And a previous call from v2 to d1's owner
      // When call task is fetched
      // Then the last contacted times should both be null
    })
  })
  it("WIP: dog last contacted time is about the dog, and owner last contacted time is about the owner", async () => {
    await withBarkContext(async ({context}) => {
      // Given vet v1
      // And dogs d1 and d2 that both prefer vet v1
      // And v1 has contacted the owner about dog d1
      // When call tasks are fetched
      // Then the last contacted time for the owner should be the same as that for dog d1 and nonnull
      // And the last contacted time for d2 should be null
    })
  })
});
