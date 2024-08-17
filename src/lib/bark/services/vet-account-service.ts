import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { VetClinic } from "../models/vet-models";
import { CODE } from "@/lib/utilities/bark-code";
import { VetClinicDao } from "../daos/vet-clinic-dao";

export class VetAccountService {
  constructor(private config: { context: BarkContext }) {}

  async getVetClinics(): Promise<
    Result<{ clinics: VetClinic[] }, typeof CODE.FAILED>
  > {
    const { dbPool } = this.config.context;
    try {
      const vetClinicDao = new VetClinicDao(dbPool);
      const clinics: VetClinic[] = await vetClinicDao.listAll();
      return Ok({ clinics });
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }
}
