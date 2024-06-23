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
  subProfile: SubProfile;
  handleSubmit: (subProfile: SubProfile) => Promise<Result<true, string>>;
  handleCancel: () => Promise<void>;
}) {
  const { vetOptions, dogProfile, subProfile, handleSubmit, handleCancel } =
    props;
  const formData = _toFormData(subProfile);
  const outData = _toSubProfile(formData);
  return (
    <div>
      <h1>Sub Profile Form</h1>
      <pre>
        {JSON.stringify(
          {
            dogProfile,
            subProfile,
            formData,
            outData,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}

function _toFormData(subProfile: SubProfile): FormData {
  const { dogWeightKg, ...fields } = subProfile;
  const out: FormData = {
    dogWeightKg: RequiredDogWeightKgField.new().format(dogWeightKg),
    ...fields,
  };
  return FormDataSchema.parse(out);
}

function _toSubProfile(formData: FormData): SubProfile {
  const { dogWeightKg, ...fields } = formData;
  const out: SubProfile = {
    dogWeightKg: RequiredDogWeightKgField.new().parse(dogWeightKg),
    ...fields,
  };
  return SubProfileSchema.parse(out);
}
