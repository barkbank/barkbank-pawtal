import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { withBarkContext } from "../_context";
import { z } from "zod";
import { CODE } from "@/lib/utilities/bark-code";
import { opGetVetLoginByEmail } from "@/lib/bark/operations/op-get-vet-login-by-email";
import { VetAccountSpec } from "@/lib/bark/models/vet-models";
import { BarkContext } from "@/lib/bark/bark-context";
import { opAddVetAccount } from "@/lib/bark/operations/op-add-vet-account";

describe("opGetVetLoginByEmail", () => {
  it("can resolve by vets.vet_email", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;
      const vetEmail = "hello@vet.com";
      const { vetId } = await _insertVet(dbPool, { email: vetEmail });
      const res = await opGetVetLoginByEmail(context, { email: vetEmail });
      expect(res.result!.vetLogin.clinic.vetId).toEqual(vetId);
    });
  });
  it("can resolve by vet_accounts.vet_account_email", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;
      const vetEmail = "hello@vet.com";
      const vetAccountEmail = "manager@vet.com";
      const { vetId } = await _insertVet(dbPool, { email: vetEmail });
      await _insertVetAccount(context, { vetAccountEmail, vetId });
      const res = await opGetVetLoginByEmail(context, {
        email: vetAccountEmail,
      });
      expect(res.result!.vetLogin.clinic.vetId).toEqual(vetId);
    });
  });
  it("returns ERROR_ACCOUNT_NOT_FOUND when there is no vet ID", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;
      const email = "hello@vet.com";
      const vetAccountEmail = "manager@vet.com";
      const otherEmail = "other@vet.com";
      const { vetId } = await _insertVet(dbPool, { email });
      await _insertVetAccount(context, { vetAccountEmail, vetId });
      const res = await opGetVetLoginByEmail(context, { email: otherEmail });
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
      await _insertVetAccount(context, {
        vetAccountEmail: email2,
        vetId: vetId1,
      });

      // WHEN retrieving vet ID by email2
      const res = await opGetVetLoginByEmail(context, { email: email2 });

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
      await _insertVetAccount(context, { vetAccountEmail: email, vetId });

      // WHEN
      const res = await opGetVetLoginByEmail(context, { email });

      // THEN...
      expect(res.result!.vetLogin.clinic.vetId).toEqual(vetId);
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
  context: BarkContext,
  args: { vetAccountEmail: string; vetId: string },
): Promise<{ vetAccountId: string }> {
  const { vetAccountEmail, vetId } = args;
  const spec: VetAccountSpec = {
    vetId,
    vetAccountEmail,
    vetAccountName: "Mandy",
  };
  const { result } = await opAddVetAccount(context, { spec });
  return { vetAccountId: result!.account.vetAccountId };
}
