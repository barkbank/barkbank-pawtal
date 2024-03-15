import { UserPii } from "@/lib/data/db-models";
import APP from "@/lib/app";
import { dbInsertUser } from "@/lib/data/db-users";
import { NextRequest, NextResponse } from "next/server";

// WIP: Change to RequestBody, update the setup-dev-data script
type RequestBody = {
  userPii: UserPii;
  userResidesInSingapore: boolean;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const pii = body as UserPii;
  const mapper = await APP.getUserMapper();
  const spec = await mapper.mapUserPiiToUserSpec(pii);
  const dbPool = await APP.getDbPool();
  const gen = await dbInsertUser(dbPool, spec);
  return NextResponse.json(gen);
}
