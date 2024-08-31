import APP from "@/lib/app";
import {
  AdminAccountSpec,
  AdminPiiSchema,
  NO_ADMIN_PERMISSIONS,
} from "@/lib/bark/models/admin-models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const pii = AdminPiiSchema.parse(body);
  const spec: AdminAccountSpec = {
    ...pii,
    ...NO_ADMIN_PERMISSIONS,
    adminCanManageDonors: true,
  };
  const service = await APP.getAdminAccountService();
  const { result, error } = await service.createAdminAccount({ spec });
  if (error !== undefined) {
    return NextResponse.json({ error });
  }
  return NextResponse.json(result);
}
