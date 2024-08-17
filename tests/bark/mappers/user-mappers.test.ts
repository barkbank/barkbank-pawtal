import { UserAccount } from "@/lib/bark/models/user-models";
import { withBarkContext } from "../_context";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import {
  toEncryptedUserAccount,
  toUserAccount,
} from "@/lib/bark/mappers/user-mappers";
import { USER_TITLE } from "@/lib/bark/enums/user-title";

describe("user-mappers", () => {
  it("provides functions to map between UserAccount and EncryptedUserAccount", async () => {
    await withBarkContext(async ({ context }) => {
      const given: UserAccount = {
        userId: "123",
        userCreationTime: new Date(),
        userEmail: "user@user.com",
        userName: "Alice Yogg",
        userPhoneNumber: "+65 9123 9123",
        userResidency: USER_RESIDENCY.SINGAPORE,
        userTitle: USER_TITLE.MS,
      };
      const encrypted = await toEncryptedUserAccount(context, given);
      const decrypted = await toUserAccount(context, encrypted);

      // THEN decrypted should match given
      expect(decrypted).toMatchObject(given);

      // AND there should not be any PII in encrypted
      //
      // NOTE: userTitle is excluded from this test because the userEncryptedPii
      //     is base64 encoded and there is a reasonable chance of false
      //     positives. The other fields contain characters that cannot be in
      //     base64 encodings and are therefore unaffected by this issue.
      expect(JSON.stringify(encrypted)).not.toContain(given.userEmail);
      // expect(JSON.stringify(encrypted)).not.toContain(given.userTitle);
      expect(JSON.stringify(encrypted)).not.toContain(given.userName);
      expect(JSON.stringify(encrypted)).not.toContain(given.userPhoneNumber);
    });
  });
});
