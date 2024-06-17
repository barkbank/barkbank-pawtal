import { withBarkContext } from "../_context";

describe("opFetchDogAppointmentsByDogId", () => {
  it("WIP: returns empty list when there are no appointments", async () => {
    await withBarkContext(async ({ context }) => {});
  });
  it("WIP: returns appointments, newests to oldest, by creation time", async () => {
    await withBarkContext(async ({ context }) => {});
  });
  it("WIP: returns ERROR_WRONG_OWNER when actorUserId is not the dog owner", async () => {
    await withBarkContext(async ({ context }) => {});
  });
});
