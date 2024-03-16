import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import {
  DogDetails,
  DogGen,
  DogOii,
  DogRecord,
  DogSecureOii,
  DogSpec,
} from "./db-models";

export class DogMapper {
  private piiEncryptionService: EncryptionService;

  constructor(config: { piiEncryptionService: EncryptionService }) {
    this.piiEncryptionService = config.piiEncryptionService;
  }

  public toDogOii(source: DogOii): DogOii {
    const { dogName } = source;
    return { dogName };
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

  public mapDogRecordToDogSpec(dogRecord: DogRecord): DogSpec {
    const dogSecureOii = this.mapDogRecordToDogSecureOii(dogRecord);
    const dogDetails = this.mapDogRecordToDogDetails(dogRecord);
    return { ...dogSecureOii, ...dogDetails };
  }

  public mapDogRecordToDogGen(dogRecord: DogRecord): DogGen {
    const { dogId, dogCreationTime, dogModificationTime } = dogRecord;
    return { dogId, dogCreationTime, dogModificationTime };
  }

  public mapDogRecordToDogSecureOii(dogRecord: DogRecord): DogSecureOii {
    const { dogEncryptedOii } = dogRecord;
    return { dogEncryptedOii };
  }

  public mapDogRecordToDogDetails(dogRecord: DogRecord): DogDetails {
    const {
      dogStatus,
      dogBirthday,
      dogBreed,
      dogGender,
      dogWeightKg,
      dogDea1Point1,
      dogEverPregnant,
      dogEverReceivedTransfusion,
    } = dogRecord;
    return {
      dogStatus,
      dogBirthday,
      dogBreed,
      dogGender,
      dogWeightKg,
      dogDea1Point1,
      dogEverPregnant,
      dogEverReceivedTransfusion,
    };
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
