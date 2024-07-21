import { Err, Ok, Result } from "@/lib/utilities/result";
import { VetClinic, VetClinicSpec } from "../models/vet-models";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { VetClinicDao } from "../daos/vet-clinic-dao";

export async function opCreateVetClinic(
  context: BarkContext,
  args: { spec: VetClinicSpec },
): Promise<Result<{ clinic: VetClinic }, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const { spec } = args;
  try {
    const dao = new VetClinicDao(dbPool);
    const clinic = await dao.insert({ spec });
    return Ok({ clinic });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
