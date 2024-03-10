import APP from "@/lib/app";
import { dbInsertDog } from "@/lib/data/db-dogs";
import { DogDetails, DogOii, DogSpec } from "@/lib/data/db-models";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  userEmail: string;
  dogOii: DogOii;
  dogDetails: DogDetails;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as RequestBody;
  const { userEmail, dogOii, dogDetails } = body;
  const mapper = await APP.getDogMapper();
  const secureOii = await mapper.mapDogOiiToDogSecureOii(dogOii);
  const spec: DogSpec = { ...secureOii, ...dogDetails };
  const dbPool = await APP.getDbPool();
  const userAccountService = await APP.getUserAccountService();
  const userId = await userAccountService.getUserIdByEmail(userEmail);
  if (userId === null) {
    return NextResponse.json(
      {
        error: `Cannot find user matching email: ${userEmail}`,
      },
      {
        status: 400,
      },
    );
  }
  const gen = await dbInsertDog(dbPool, userId, spec);
  return NextResponse.json(gen);
}
