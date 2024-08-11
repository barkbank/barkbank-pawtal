import { UserAccount } from "@/lib/bark/models/user-models";
import { withBarkContext } from "../_context";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import {
  toEncryptedUserAccount,
  toUserAccount,
} from "@/lib/bark/mappers/user-mappers";

describe("user-mappers", () => {
  it("provides functions to map between UserAccount and EncryptedUserAccount", async () => {
    await withBarkContext(async ({ context }) => {
      const given: UserAccount = {
        userId: "123",
        userCreationTime: new Date(),
        userEmail: "user@user.com",
        userName: "Alice Yogg",
        userPhoneNumber: "12345678",
        userResidency: USER_RESIDENCY.SINGAPORE,
        userTitle: "Mushroom", // TODO: This should be an enumeration
      };
      const encrypted = await toEncryptedUserAccount(context, given);
      const decrypted = await toUserAccount(context, encrypted);

      // THEN decrypted should match given
      expect(decrypted).toMatchObject(given);

      // AND there should not be any PII in encrypted
      expect(JSON.stringify(encrypted)).not.toContain(given.userEmail);
      expect(JSON.stringify(encrypted)).not.toContain(given.userTitle);
      expect(JSON.stringify(encrypted)).not.toContain(given.userName);
      expect(JSON.stringify(encrypted)).not.toContain(given.userPhoneNumber);
    });
  });
});
