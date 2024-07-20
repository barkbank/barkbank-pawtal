import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { VetClinic } from "../models/vet-models";
import { CODE } from "@/lib/utilities/bark-code";
import { selectVetClinics } from "../queries/select-vet-clinics";

export async function opGetVetClinics(
  context: BarkContext,
): Promise<Result<{ clinics: VetClinic[] }, typeof CODE.FAILED>> {
  const { dbPool } = context;
  try {
    const clinics: VetClinic[] = await selectVetClinics(dbPool);
    return Ok({ clinics });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
