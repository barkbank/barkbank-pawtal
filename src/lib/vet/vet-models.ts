import { YesNoUnknown } from "../bark/enums/yes-no";
import { DogGender } from "../bark/models/dog-gender";

// WIP: Define CallTask and EncryptedCallTask in lib/bark/models based fields in AvailableDog and OwnerContactDetails.
// CallTask ::= {dog: DogFields, owner: OwnerContactDetails}

// WIP: Delete AvailableDog when migrated to call tasks.
export type AvailableDog = {
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogEverPregnant: YesNoUnknown;
};
