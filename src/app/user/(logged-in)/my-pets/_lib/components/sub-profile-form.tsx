import { OptionalDogWeightKgField } from "@/app/_lib/field-schemas/optional-dog-weight-kg-field";
import { RequiredDogWeightKgField } from "@/app/_lib/field-schemas/required-dog-weight-kg-field";
import { BarkFormOption } from "@/components/bark/bark-form";
import { YesNoSchema } from "@/lib/bark/enums/yes-no";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import { SubProfile, SubProfileSchema } from "@/lib/bark/models/sub-profile";
import { Result } from "@/lib/utilities/result";
import { z } from "zod";

const FormDataSchema = z.object({
  dogName: z.string(),
  dogWeightKg: RequiredDogWeightKgField.new().schema(),
  dogEverPregnant: YesNoSchema,
  dogEverReceivedTransfusion: YesNoSchema,
  dogPreferredVetId: z.string(),
});

type FormData = z.infer<typeof FormDataSchema>;

export function SubProfileForm(props: {
  vetOptions: BarkFormOption[];
  dogProfile: DogProfile;
  handleSubmit: (subProfile: SubProfile) => Promise<Result<true, string>>;
  handleCancel: () => Promise<void>;
}) {
  return <div>SubProfileForm</div>;
}

function _toFormData(dogProfile: DogProfile): FormData {
  const out: FormData = {
    dogName: dogProfile.dogName,
    dogWeightKg:
      dogProfile.dogWeightKg === null ? "" : dogProfile.dogWeightKg.toString(),
    dogEverPregnant:
      dogProfile.dogEverPregnant === YES_NO_UNKNOWN.UNKNOWN
        ? YES_NO_UNKNOWN.NO
        : dogProfile.dogEverPregnant,
    dogEverReceivedTransfusion:
      dogProfile.dogEverReceivedTransfusion === YES_NO_UNKNOWN.UNKNOWN
        ? YES_NO_UNKNOWN.NO
        : dogProfile.dogEverReceivedTransfusion,
    dogPreferredVetId: dogProfile.dogPreferredVetId,
  };
  return FormDataSchema.parse(out);
}

function _toSubProfile(formData: FormData): SubProfile {
  return SubProfileSchema.parse({});
}
