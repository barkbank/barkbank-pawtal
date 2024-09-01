import APP from "@/lib/app";
import { NextRequest, NextResponse } from "next/server";
import { VetClinicSpecSchema } from "@/lib/bark/models/vet-models";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const spec = VetClinicSpecSchema.parse(body);
  const service = await APP.getVetAccountService();
  const { result, error } = await service.createVetClinic({ spec });
  if (error !== undefined) {
    throw new Error(error);
  }
  return NextResponse.json({ vet: result.clinic });
}
