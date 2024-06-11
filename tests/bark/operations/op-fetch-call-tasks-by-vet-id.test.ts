import { opFetchCallTasksByVetId } from "@/lib/bark/operations/op-fetch-call-tasks-by-vet-id";
import { withBarkContext } from "../_context";
import { givenDog, givenReport, givenVet } from "../_given";

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
      const { dogId, vetId } = await givenReport(context, {
        idx: 1,
        reportOverrides: { dogDidDonateBlood: false, dogWeightKg: 99999 },
      });
      const { result, error } = await opFetchCallTasksByVetId(context, {
        vetId,
      });
      expect(error).toBeUndefined();
      const { callTasks } = result!;
      expect(callTasks[0].dogWeightKg).toEqual(99999);
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
});
