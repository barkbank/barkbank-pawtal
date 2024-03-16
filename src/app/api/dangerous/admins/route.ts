import { AdminPii } from "@/lib/data/db-models";
import APP from "@/lib/app";
import { dbInsertAdmin } from "@/lib/data/db-admins";
import { NO_ADMIN_PERMISSIONS, AdminSpec } from "@/lib/data/db-models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const pii = body as AdminPii;
  const mapper = await APP.getAdminMapper();
  const securePii = await mapper.mapAdminPiiToAdminSecurePii(pii);
  const spec: AdminSpec = {
    ...securePii,
    ...NO_ADMIN_PERMISSIONS,
    adminCanManageDonors: true,
  };
  const dbPool = await APP.getDbPool();
  const gen = await dbInsertAdmin(dbPool, spec);
  return NextResponse.json(gen);
}
