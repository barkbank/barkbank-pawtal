import { UserResidencySchema } from "@/lib/bark/enums/user-residency";
import APP from "@/lib/app";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserPiiSchema } from "@/lib/bark/models/user-pii";
import { UserAccountSpec } from "@/lib/bark/models/user-models";

const RequestBodySchema = z.object({
  userPii: UserPiiSchema,
  userResidency: UserResidencySchema,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const validated = RequestBodySchema.parse(body);
  const { userPii, userResidency } = validated;
  const spec: UserAccountSpec = {
    ...userPii,
    userResidency,
  };
  const service = await APP.getUserAccountService();
  const { result, error } = await service.create({ spec });
  if (error) {
    return NextResponse.json({ error });
  }
  return NextResponse.json(result);
}
