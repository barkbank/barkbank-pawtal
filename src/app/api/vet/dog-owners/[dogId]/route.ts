import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { HttpStatus } from "@/app/_lib/http-status-codes";
import { getOwnerContactDetails } from "@/lib/vet/actions/get-owner-contact-details";
import { CODE } from "@/lib/utilities/bark-code";

export async function GET(
  request: NextRequest,
  args: { params: { dogId: string } },
): Promise<NextResponse> {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    return NextResponse.json({}, { status: HttpStatus.HTTP_401_UNAUTHORIZED });
  }
  const { dogId } = args.params;
  const { result: ownerContactDetails, error } = await getOwnerContactDetails(
    actor,
    dogId,
  );
  if (error === CODE.ERROR_DOG_NOT_FOUND) {
    return NextResponse.json({}, { status: HttpStatus.HTTP_404_NOT_FOUND });
  }
  if (error === CODE.ERROR_NOT_PREFERRED_VET) {
    return NextResponse.json({}, { status: HttpStatus.HTTP_403_FORBIDDEN });
  }
  if (error !== undefined) {
    return NextResponse.json(
      {},
      { status: HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR },
    );
  }
  return NextResponse.json(
    { ownerContactDetails },
    { status: HttpStatus.HTTP_200_OK },
  );
}
