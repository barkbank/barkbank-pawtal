import { UserPii } from "@/lib/bark/models/user-pii";
import { withBarkContext } from "../_context";
import { toEncryptedUserPii } from "@/lib/bark/mappers/user-mappers";
import { EncryptedUserFields } from "@/lib/bark/models/encrypted-user-fields";
import { toReEncryptedUserFields } from "@/lib/bark/mappers/to-re-encrypted-user-fields";
import { toUserPii } from "@/lib/bark/mappers/user-mappers";

describe("toReEncryptedUserFields", () => {
  it("should re-encrypt Encrypted User Fields", async () => {
    await withBarkContext(async ({ context }) => {
      // GIVEN user...
      const userId = "123";
      const userPii: UserPii = {
        userName: "John",
        userEmail: "john@user.com",
        userPhoneNumber: "+65 98128734",
      };

      // AND encrypted user fields...
      const userEncryptedPii = await toEncryptedUserPii(context, userPii);
      const encryptedUserFields: EncryptedUserFields = {
        userId,
        userEncryptedPii,
      };

      // WHEN re-encrypted
      const reEncryptedUserFields = await toReEncryptedUserFields(
        context,
        encryptedUserFields,
      );

      // THEN...
      expect(reEncryptedUserFields.userId).toEqual(userId);
      expect(reEncryptedUserFields.userEncryptedPii).not.toEqual(
        userEncryptedPii,
      );
      const decryptedPii = await toUserPii(
        context,
        reEncryptedUserFields.userEncryptedPii,
      );
      expect(decryptedPii.userName).toEqual(userPii.userName);
      expect(decryptedPii.userEmail).toEqual(userPii.userEmail);
      expect(decryptedPii.userPhoneNumber).toEqual(userPii.userPhoneNumber);
    });
  });
});
