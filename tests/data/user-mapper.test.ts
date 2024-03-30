import { UserPii, UserSecurePii } from "@/lib/data/db-models";
import { getPiiEncryptionService, getUserMapper } from "../_fixtures";

describe("UserMapper", () => {
  describe("mapUserPiiToUserSecurePii", () => {
    it("should encrypt only the fields in UserPii", async () => {
      const userPii: UserPii = {
        userEmail: "some@one.com",
        userName: "Some One",
        userPhoneNumber: "65437890",
      };
      const input = { ...userPii, otherData: "value" };
      const mapper = getUserMapper();
      const securePii: UserSecurePii =
        await mapper.mapUserPiiToUserSecurePii(input);
      const piiEncryptionService = getPiiEncryptionService();
      const decryptedData = await piiEncryptionService.getDecryptedData(
        securePii.userEncryptedPii,
      );
      const decryptedObj = JSON.parse(decryptedData);
      expect(Object.keys(decryptedObj).includes("otherData")).toBe(false);
    });
  });
});
