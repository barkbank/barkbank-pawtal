import APP from "@/lib/app";
import { NextRequest, NextResponse } from "next/server";
import { VetAccountSpecSchema } from "@/lib/bark/models/vet-models";
import { opAddVetAccount } from "@/lib/bark/operations/op-add-vet-account";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const spec = VetAccountSpecSchema.parse(body);
  const context = await APP.getBarkContext();
  const { result, error } = await opAddVetAccount(context, { spec });
  if (error !== undefined) {
    throw new Error(error);
  }
  return NextResponse.json(result);
}
