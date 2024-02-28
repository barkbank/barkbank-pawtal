import APP from "@/lib/app";
import { dbInsertVet } from "@/lib/data/dbVets";
import { VetSpec } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!APP.shouldAllowDangerousApiCalls()) {
    return NextResponse.json({}, { status: 404 });
  }
  const body = await request.json();
  const spec = body as VetSpec;
  const dbPool = await APP.getDbPool();
  const gen = await dbInsertVet(dbPool, spec);
  return NextResponse.json(gen);
}
