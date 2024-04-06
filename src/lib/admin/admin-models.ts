import { YesNoUnknown } from "../data/db-enums";

export type IncompleteProfile = {
  dogName: string;
  dogBreed: string;
  dogWeightKg: number | null;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
};
