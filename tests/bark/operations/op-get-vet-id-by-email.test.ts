import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { withBarkContext } from "../_context";
import { z } from "zod";
import { opGetVetIdByEmail } from "@/lib/bark/operations/op-get-vet-id-by-email";
import { CODE } from "@/lib/utilities/bark-code";

describe("opGetVetIdByEmail", () => {
  it("can resolve by vets.vet_email", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;
      const email = "hello@vet.com";
      const { vetId } = await _insertVet(dbPool, { email });
      const res = await opGetVetIdByEmail(context, { email });
      expect(res.result!.vetId).toEqual(vetId);
    });
  });
  it("can resolve by vet_accounts.vet_account_email", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;
      const email = "hello@vet.com";
      const accountEmail = "manager@vet.com";
      const { vetId } = await _insertVet(dbPool, { email });
      await _insertVetAccount(dbPool, { email: accountEmail, vetId });
      const res = await opGetVetIdByEmail(context, { email: accountEmail });
      expect(res.result!.vetId).toEqual(vetId);
    });
  });
  it("returns ERROR_ACCOUNT_NOT_FOUND when there is no vet ID", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;
      const email = "hello@vet.com";
      const accountEmail = "manager@vet.com";
      const otherEmail = "other@vet.com";

      const { vetId } = await _insertVet(dbPool, { email });
      await _insertVetAccount(dbPool, { email: accountEmail, vetId });

      const res = await opGetVetIdByEmail(context, { email: otherEmail });
      expect(res.error).toEqual(CODE.ERROR_ACCOUNT_NOT_FOUND);
    });
  });
  it("returns ERROR_MULTIPLE_VET_IDS when there are multiple vet IDs", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;

      // GIVEN vet1
      const email1 = "hello@vet1.com";
      const { vetId: vetId1 } = await _insertVet(dbPool, { email: email1 });

      // AND vet2 with email that has an account at vet1
      const email2 = "hello@vet2.com";
      await _insertVet(dbPool, { email: email2 });
      await _insertVetAccount(dbPool, { email: email2, vetId: vetId1 });

      // WHEN retrieving vet ID by email2
      const res = await opGetVetIdByEmail(context, { email: email2 });

      // THEN...
      expect(res.error).toEqual(CODE.ERROR_MULTIPLE_VET_IDS);
    });
  });
  it("can resolve when both vet and vet account have same email", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;

      // GIVEN vet1
      const email = "hello@vet1.com";
      const { vetId } = await _insertVet(dbPool, { email });
      await _insertVetAccount(dbPool, { email, vetId });

      // WHEN
      const res = await opGetVetIdByEmail(context, { email });

      // THEN...
      expect(res.result!.vetId).toEqual(vetId);
    });
  });
});

async function _insertVet(
  db: DbContext,
  args: { email: string },
): Promise<{ vetId: string }> {
  const { email } = args;
  const RowSchema = z.object({ vetId: z.string() });
  type Row = z.infer<typeof RowSchema>;
  const sql = `
  INSERT INTO vets (
    vet_email,
    vet_name,
    vet_phone_number,
    vet_address
  )
  VALUES (
    $1,
    'Vet Clinic',
    '61238888',
    '26 Albert Ave Singpapore 912064'
  )
  RETURNING vet_id as "vetId"
  `;
  const res = await dbQuery<Row>(db, sql, [email]);
  const row = RowSchema.parse(res.rows[0]);
  return row;
}

async function _insertVetAccount(
  db: DbContext,
  args: { email: string; vetId: string },
): Promise<{ vetAccountId: string }> {
  const { email, vetId } = args;
  const RowSchema = z.object({ vetAccountId: z.string() });
  type Row = z.infer<typeof RowSchema>;
  const sql = `
  INSERT INTO vet_accounts (
    vet_account_email,
    vet_id
  )
  VALUES ($1, $2)
  RETURNING vet_account_id as "vetAccountId"
  `;
  const res = await dbQuery<Row>(db, sql, [email, vetId]);
  const row = RowSchema.parse(res.rows[0]);
  return row;
}