"use server";

import APP from "@/lib/app";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { VetClinic, VetClinicSpec } from "@/lib/bark/models/vet-models";
import { opCreateVetClinic } from "@/lib/bark/operations/op-create-vet-clinic";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { revalidatePath } from "next/cache";

export async function postVetClinicSpec(args: {
  spec: VetClinicSpec;
}): Promise<
  Result<
    { clinic: VetClinic },
    typeof CODE.ERROR_NOT_LOGGED_IN | typeof CODE.FAILED
  >
> {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    return Err(CODE.ERROR_NOT_LOGGED_IN);
  }
  const context = await APP.getBarkContext();
  const { spec } = args;
  const { result, error } = await opCreateVetClinic(context, { spec });
  if (error !== undefined) {
    return Err(error);
  }
  revalidatePath(RoutePath.ADMIN_TOOLS_VETS_LIST_CLINICS, "layout");
  return Ok(result);
}
