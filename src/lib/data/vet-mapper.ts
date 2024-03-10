import { Vet, VetGen, VetSpec } from "./db-models";

export class VetMapper {
  public mapVetToVetSpec(vet: Vet): VetSpec {
    const { vetEmail, vetName, vetPhoneNumber, vetAddress } = vet;
    return {
      vetEmail,
      vetName,
      vetPhoneNumber,
      vetAddress,
    };
  }

  public mapVetToVetGen(vet: Vet): VetGen {
    const { vetId, vetCreationTime, vetModificationTime } = vet;
    return { vetId, vetCreationTime, vetModificationTime };
  }
}
