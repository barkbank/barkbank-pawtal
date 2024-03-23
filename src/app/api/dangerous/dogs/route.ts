import APP from "@/lib/app";
import { dbInsertDog } from "@/lib/data/db-dogs";
import { DogDetails, DogOii, DogSpec } from "@/lib/data/db-models";
import { dbSelectUserIdByHashedEmail } from "@/lib/data/db-users";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  userEmail: string;
  dogOii: DogOii;
  dogDetails: DogDetails;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as RequestBody;
  const { userEmail, dogOii, dogDetails } = body;
  const [dbPool, dogMapper, emailHashService] = await Promise.all([
    APP.getDbPool(),
    APP.getDogMapper(),
    APP.getEmailHashService(),
  ]);

  const secureOii = await dogMapper.mapDogOiiToDogSecureOii(dogOii);
  const spec: DogSpec = { ...secureOii, ...dogDetails };
  const userHashedEmail = await emailHashService.getHashHex(userEmail);
  const userId = await dbSelectUserIdByHashedEmail(dbPool, userHashedEmail);
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
