import APP from "@/lib/app";
import { NextRequest, NextResponse } from "next/server";
import { VetAccountSpecSchema } from "@/lib/bark/models/vet-models";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const spec = VetAccountSpecSchema.parse(body);
  const service = await APP.getVetAccountService();
  const { result, error } = await service.addVetAccount({ spec });
  if (error !== undefined) {
    throw new Error(error);
  }
  const { account } = result;
  return NextResponse.json({ account });
}
