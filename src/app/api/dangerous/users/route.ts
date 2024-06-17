import { UserPii } from "@/lib/data/db-models";
import { UserResidency } from "@/lib/bark/enums/user-residency";
import APP from "@/lib/app";
import { dbInsertUser } from "@/lib/data/db-users";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  userPii: UserPii;
  userResidency: UserResidency;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as RequestBody;
  const { userPii, userResidency } = body;
  const mapper = await APP.getUserMapper();
  const securePii = await mapper.mapUserPiiToUserSecurePii(userPii);
  const spec = { ...securePii, userResidency };
  const dbPool = await APP.getDbPool();
  const gen = await dbInsertUser(dbPool, spec);
  return NextResponse.json(gen);
}
