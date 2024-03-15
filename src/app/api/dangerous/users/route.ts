import { UserPii } from "@/lib/data/db-models";
import APP from "@/lib/app";
import { dbInsertUser } from "@/lib/data/db-users";
import { NextRequest, NextResponse } from "next/server";

// WIP: update the setup-dev-data script to supply RequestBody
type RequestBody = {
  userPii: UserPii;
  userResidesInSingapore: boolean;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as RequestBody;
  const { userPii, userResidesInSingapore } = body;
  const mapper = await APP.getUserMapper();
  const securePii = await mapper.mapUserPiiToUserSecurePii(userPii);
  const spec = { ...securePii, userResidesInSingapore };
  const dbPool = await APP.getDbPool();
  const gen = await dbInsertUser(dbPool, spec);
  return NextResponse.json(gen);
}
