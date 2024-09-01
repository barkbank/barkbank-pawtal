import {
  AdminAccountSpec,
  AdminAccountSpecSchema,
} from "@/lib/bark/models/admin-models";
import { withBarkContext } from "../_context";
import {
  toAdminAccount,
  toEncryptedAdminAccountSpec,
} from "@/lib/bark/mappers/admin-mappers";
import { EncryptedAdminAccountDao } from "@/lib/bark/daos/encrypted-admin-account-dao";

describe("EncryptedAdminAccountDao", () => {
  it("insert() should persist", async () => {
    await withBarkContext(async ({ context }) => {
      const s1 = _mockAdminAccountSpec();
      const e1 = await toEncryptedAdminAccountSpec(context, s1);
      const dao = new EncryptedAdminAccountDao(context.dbPool);
      const { adminId } = await dao.insert({ spec: e1 });
      const e2 = await dao.getByAdminId({ adminId });
      const a2 = await toAdminAccount(context, e2!);
      const s2 = AdminAccountSpecSchema.parse(a2);
      expect(s2).toMatchObject(s1);
      expect(s1).toMatchObject(s2);
    });
  });
  it("update modifies an account", async () => {
    await withBarkContext(async ({ context }) => {
      const dao = new EncryptedAdminAccountDao(context.dbPool);

      const s1 = _mockAdminAccountSpec({
        adminName: "John",
        adminCanManageDonors: false,
      });
      const e1 = await toEncryptedAdminAccountSpec(context, s1);
      const { adminId } = await dao.insert({ spec: e1 });

      const s2 = _mockAdminAccountSpec({
        adminName: "John Green",
        adminCanManageDonors: true,
      });
      const e2 = await toEncryptedAdminAccountSpec(context, s2);
      const didUpdate = await dao.update({ adminId, spec: e2 });
      expect(didUpdate).toBe(true);

      const e3 = await dao.getByAdminId({ adminId });
      expect(e3).toMatchObject(e2);
      expect(e3).not.toMatchObject(e1);
    });
  });
  it("delete removes an account", async () => {
    await withBarkContext(async ({ context }) => {
      const dao = new EncryptedAdminAccountDao(context.dbPool);
      const s1 = _mockAdminAccountSpec();
      const e1 = await toEncryptedAdminAccountSpec(context, s1);
      const { adminId } = await dao.insert({ spec: e1 });
      const didDelete = await dao.delete({ adminId });
      expect(didDelete).toBe(true);
      const e2 = await dao.getByAdminId({ adminId });
      expect(e2).toBeNull();
    });
  });
  it("getList returns admins in ID order", async () => {
    await withBarkContext(async ({ context }) => {
      const s1 = _mockAdminAccountSpec({ adminEmail: "admin1@test.com" });
      const s2 = _mockAdminAccountSpec({ adminEmail: "admin2@test.com" });
      const dao = new EncryptedAdminAccountDao(context.dbPool);
      await dao.insert({
        spec: await toEncryptedAdminAccountSpec(context, s1),
      });
      await dao.insert({
        spec: await toEncryptedAdminAccountSpec(context, s2),
      });
      const x = await dao.getList();
      const id1 = parseInt(x[0].adminId);
      const id2 = parseInt(x[1].adminId);
      expect(id1).toBeLessThan(id2);
    });
  });
  it("getAdminIdByAdminHashedEmail", async () => {
    await withBarkContext(async ({ context }) => {
      const s1 = _mockAdminAccountSpec();
      const e1 = await toEncryptedAdminAccountSpec(context, s1);
      const { adminHashedEmail } = e1;
      const dao = new EncryptedAdminAccountDao(context.dbPool);
      const { adminId } = await dao.insert({ spec: e1 });
      const id2 = await dao.getAdminIdByAdminHashedEmail({ adminHashedEmail });
      expect(id2?.adminId).toEqual(adminId);
    });
  });
});

function _mockAdminAccountSpec(
  overrides?: Partial<AdminAccountSpec>,
): AdminAccountSpec {
  const base: AdminAccountSpec = {
    adminEmail: "admin@test.com",
    adminName: "Adam MIN",
    adminPhoneNumber: "99911122",
    adminCanManageAdminAccounts: true,
    adminCanManageVetAccounts: true,
    adminCanManageUserAccounts: true,
    adminCanManageDonors: true,
  };
  return AdminAccountSpecSchema.parse({ ...base, ...overrides });
}
