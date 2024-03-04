import { AdminPii, encryptAdminPii } from "@/lib/admin/admin-pii";
import APP from "@/lib/app";
import { dbInsertAdmin } from "@/lib/data/db-admins";
import { ADMIN_NO_PERMISSIONS, AdminSpec } from "@/lib/data/db-models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const pii = body as AdminPii;
  const emailHashService = await APP.getEmailHashService();
  const piiEncryptionService = await APP.getPiiEncryptionService();
  const adminHashedEmail = await emailHashService.getHashHex(pii.adminEmail);
  const adminEncryptedPii = await encryptAdminPii(pii, piiEncryptionService);
  const spec: AdminSpec = {
    adminHashedEmail,
    adminEncryptedPii,
    ...ADMIN_NO_PERMISSIONS,
  };
  const dbPool = await APP.getDbPool();
  const gen = await dbInsertAdmin(dbPool, spec);
  return NextResponse.json(gen);
}
