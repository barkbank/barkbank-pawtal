import { UserPii, encryptUserPii } from "@/lib/user/user-pii";
import APP from "@/lib/app";
import { dbInsertUser } from "@/lib/data/dbUsers";
import { UserSpec } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!APP.getDangerousApiIsEnabled()) {
    return NextResponse.json({}, { status: 404 });
  }
  const body = await request.json();
  const pii = body as UserPii;
  const emailHashService = await APP.getEmailHashService();
  const piiEncryptionService = await APP.getPiiEncryptionService();
  const userHashedEmail = await emailHashService.getHashHex(pii.userEmail);
  const userEncryptedPii = await encryptUserPii(pii, piiEncryptionService);
  const spec: UserSpec = { userHashedEmail, userEncryptedPii };
  const dbPool = await APP.getDbPool();
  const gen = await dbInsertUser(dbPool, spec);
  return NextResponse.json(gen);
}
