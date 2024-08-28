import { withBarkContext } from "../_context";
import { toReEncryptedAdminFields } from "@/lib/bark/mappers/to-re-encrypted-admin-fields";
import { AdminPii } from "@/lib/bark/models/admin-pii";
import { EncryptedAdminFields } from "@/lib/bark/models/encrypted-admin-fields";
import { toAdminEncryptedPii } from "@/lib/bark/mappers/admin-mappers";
import { toAdminPii } from "@/lib/bark/mappers/admin-mappers";

describe("toReEncryptedAdminFields", () => {
  it("should re-encrypt Encrypted User Fields", async () => {
    await withBarkContext(async ({ context }) => {
      // GIVEN admin...
      const adminId = "123";
      const adminPii: AdminPii = {
        adminName: "John",
        adminEmail: "john@admin.com",
        adminPhoneNumber: "+65 98128734",
      };

      // AND encrypted user fields...
      const adminEncryptedPii = await toAdminEncryptedPii(context, adminPii);
      const encryptedAdminFields: EncryptedAdminFields = {
        adminId,
        adminEncryptedPii,
      };

      // WHEN re-encrypted
      const reEncryptedAdminFields = await toReEncryptedAdminFields(
        context,
        encryptedAdminFields,
      );

      // THEN...
      expect(reEncryptedAdminFields.adminId).toEqual(adminId);
      expect(reEncryptedAdminFields.adminEncryptedPii).not.toEqual(
        adminEncryptedPii,
      );
      const decryptedPii = await toAdminPii(
        context,
        reEncryptedAdminFields.adminEncryptedPii,
      );
      expect(decryptedPii.adminName).toEqual(adminPii.adminName);
      expect(decryptedPii.adminEmail).toEqual(adminPii.adminEmail);
      expect(decryptedPii.adminPhoneNumber).toEqual(adminPii.adminPhoneNumber);
    });
  });
});
