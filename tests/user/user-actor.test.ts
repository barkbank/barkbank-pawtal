import { DogProfileSpecSchema } from "@/lib/bark/models/dog-profile-models";
import { getUserActor, insertUser, mockDogProfileSpec } from "../_fixtures";
import { withBarkContext } from "../bark/_context";

describe("UserActor", () => {
  it("can add and get dog", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;
      const { userId } = await insertUser(1, dbPool);
      const actor = getUserActor(dbPool, userId);
      const spec = mockDogProfileSpec();
      const resAdd = await actor.addDogProfile({ spec });
      expect(resAdd.error).toBeUndefined();
      const { dogId } = resAdd.result!;
      const resGet = await actor.getDogProfile({ dogId });
      expect(resGet.error).toBeUndefined();
      const receivedSpec = DogProfileSpecSchema.parse(resGet.result);
      expect(receivedSpec).toMatchObject(spec);
      expect(spec).toMatchObject(receivedSpec);
    });
  });
});
