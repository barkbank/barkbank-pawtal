import { VetGen, VetSpec } from "./db-models";

export class VetMapper {
  public toVetSpec(source: VetSpec): VetSpec {
    const { vetEmail, vetName, vetPhoneNumber, vetAddress } = source;
    return {
      vetEmail,
      vetName,
      vetPhoneNumber,
      vetAddress,
    };
  }

  public toVetGen(source: VetGen): VetGen {
    const { vetId, vetCreationTime, vetModificationTime } = source;
    return { vetId, vetCreationTime, vetModificationTime };
  }
}
