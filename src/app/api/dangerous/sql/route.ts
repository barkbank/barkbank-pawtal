import APP from "@/lib/app";
import { dbQuery } from "@/lib/data/db-utils";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  sql: string;
  args: any[];
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as RequestBody;
  const { sql, args } = body;
  const dbPool = await APP.getDbPool();
  const res = await dbQuery(dbPool, sql, args);
  const { rows } = res;
  return NextResponse.json({ rows });
}
