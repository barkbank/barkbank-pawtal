import {
  AdminAccount,
  AdminAccountSchema,
} from "@/lib/bark/models/admin-models";
import { withBarkContext } from "../_context";
import {
  toAdminAccount,
  toEncryptedAdminAccount,
} from "@/lib/bark/mappers/admin-mappers";

describe("admin-mappers", () => {
  it("should be possible to encrypt and decrypt admin accounts", async () => {
    await withBarkContext(async ({ context }) => {
      const a1 = _mockAdminAccount();
      const e1 = await toEncryptedAdminAccount(context, a1);
      const a2 = await toAdminAccount(context, e1);
      expect(a2).toMatchObject(a1);
      expect(a1).toMatchObject(a2);
    });
  });
});

function _mockAdminAccount(): AdminAccount {
  const out: AdminAccount = {
    adminId: "123",
    adminEmail: "admin@test.com",
    adminName: "Adam MIN",
    adminPhoneNumber: "99911122",
    adminCanManageAdminAccounts: true,
    adminCanManageVetAccounts: true,
    adminCanManageUserAccounts: true,
    adminCanManageDonors: true,
  };
  return AdminAccountSchema.parse(out);
}
