import { BarkContext } from "@/lib/bark/bark-context";
import { withBarkContext } from "../_context";
import { UserAccountSpec } from "@/lib/bark/models/user-models";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { UserAccountService } from "@/lib/bark/services/user-account-service";

describe("DogProfileService", () => {
  it("can be used to create and retrieve dog profile", async () => {
    await withBarkContext(async ({ context }) => {});
  });
  it("can list dog profiles by user", async () => {
    await withBarkContext(async ({ context }) => {});
  });

  describe("When there is no existing report", () => {
    it("can be used to update dog profile", async () => {
      await withBarkContext(async ({ context }) => {});
    });
    it("cannot be used to update sub profile", async () => {
      await withBarkContext(async ({ context }) => {});
    });
  });

  describe("When there is an existing medical report", () => {
    it("cannot be used to update dog profile", async () => {
      await withBarkContext(async ({ context }) => {});
    });
    it("can be used to update sub profile", async () => {
      await withBarkContext(async ({ context }) => {});
    });
  });
});

async function _createTestUser(args: {
  context: BarkContext;
  idx: number;
}): Promise<{ userId: string }> {
  const { context, idx } = args;
  const spec: UserAccountSpec = {
    userEmail: `user${idx}@testuser.com`,
    userTitle: USER_TITLE.MR,
    userName: `Wax ${idx}`,
    userPhoneNumber: `3300 100 ${idx}`,
    userResidency: USER_RESIDENCY.SINGAPORE,
  };
  const service = new UserAccountService(context);
  const { result, error } = await service.create({ spec });
  if (error !== undefined) {
    throw new Error("Failed to create test user");
  }
  const { userId } = result;
  return { userId };
}
