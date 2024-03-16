import { EncryptionService } from "../services/encryption";
import { DogDetails, DogGen, DogOii, DogSecureOii, DogSpec } from "./db-models";

export class DogMapper {
  private piiEncryptionService: EncryptionService;

  constructor(config: { piiEncryptionService: EncryptionService }) {
    this.piiEncryptionService = config.piiEncryptionService;
  }

  public toDogOii(source: DogOii): DogOii {
    const { dogName } = source;
    return { dogName };
  }

  public toDogSecureOii(source: DogSecureOii): DogSecureOii {
    const { dogEncryptedOii } = source;
    return { dogEncryptedOii };
  }

  public toDogDetails(source: DogDetails): DogDetails {
    const {
      dogStatus,
      dogBreed,
      dogBirthday,
      dogGender,
      dogWeightKg,
      dogDea1Point1,
      dogEverPregnant,
      dogEverReceivedTransfusion,
    } = source;
    return {
      dogStatus,
      dogBreed,
      dogBirthday,
      dogGender,
      dogWeightKg,
      dogDea1Point1,
      dogEverPregnant,
      dogEverReceivedTransfusion,
    };
  }

  public toDogSpec(source: DogSpec): DogSpec {
    const dogSecureOii = this.toDogSecureOii(source);
    const dogDetails = this.toDogDetails(source);
    return { ...dogSecureOii, ...dogDetails };
  }

  public toDogGen(source: DogGen): DogGen {
    const { dogId, dogCreationTime, dogModificationTime } = source;
    return { dogId, dogCreationTime, dogModificationTime };
  }

  public async mapDogSecureOiiToDogOii(
    dogSecureOii: DogSecureOii,
  ): Promise<DogOii> {
    const jsonEncoded = await this.piiEncryptionService.getDecryptedData(
      dogSecureOii.dogEncryptedOii,
    );
    const obj = JSON.parse(jsonEncoded) as DogOii;
    return this.toDogOii(obj);
  }

  public async mapDogOiiToDogSecureOii(dogOii: DogOii): Promise<DogSecureOii> {
    const oii: DogOii = this.toDogOii(dogOii);
    const jsonEncoded = JSON.stringify(oii);
    const dogEncryptedOii =
      await this.piiEncryptionService.getEncryptedData(jsonEncoded);
    return { dogEncryptedOii };
  }
}
