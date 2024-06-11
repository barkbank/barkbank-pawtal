import { opFetchCallTasksByVetId } from "@/lib/bark/operations/op-fetch-call-tasks-by-vet-id";
import { withBarkContext } from "../_context";
import { givenVet } from "../_given";

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
  it("WIP: should return list of call tasks", async () => {
    await withBarkContext(async ({ context }) => {});
  });
  it("WIP: should use latest values in call task", async () => {
    await withBarkContext(async ({ context }) => {});
  });
  it("WIP: should exclude dog profile that is incomplete", async () => {
    await withBarkContext(async ({ context }) => {});
  });
  it("WIP: should exclude call task of another vet", async () => {
    await withBarkContext(async ({ context }) => {});
  });
});
