import APP from "@/lib/app";
import { dbInsertVet } from "@/lib/data/db-vets";
import { VetSpec } from "@/lib/data/db-models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const spec = body as VetSpec;
  const dbPool = await APP.getDbPool();
  const gen = await dbInsertVet(dbPool, spec);
  const vet = { ...spec, ...gen };
  return NextResponse.json({ vet });
}
