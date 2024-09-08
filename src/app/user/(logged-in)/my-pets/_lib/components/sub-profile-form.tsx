"use client";

import { RequiredDogWeightKgField } from "@/app/_lib/field-schemas/required-dog-weight-kg-field";
import { formatBirthday, formatBloodType } from "@/app/_lib/formatters";
import { BarkButton } from "@/components/bark/bark-button";
import { BarkForm } from "@/components/bark/bark-form";
import { BarkFormError } from "@/components/bark/bark-form-error";
import { BarkFormInput } from "@/components/bark/bark-form-input";
import { BarkFormRadioGroup } from "@/components/bark/bark-form-radio-group";
import { BarkFormOption } from "@/components/bark/bark-form-option";
import { YesNoSchema } from "@/lib/bark/enums/yes-no";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DogProfileSpec } from "@/lib/bark/models/dog-profile-models";
import {
  SubProfileSpec,
  SubProfileSpecSchema,
} from "@/lib/bark/models/dog-profile-models";
import { Result } from "@/lib/utilities/result";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  dogProfile: DogProfileSpec;
  subProfile: SubProfileSpec;
  handleSubmit: (subProfile: SubProfileSpec) => Promise<Result<true, string>>;
  handleCancel: () => Promise<void>;
}) {
  const { vetOptions, dogProfile, subProfile, handleSubmit, handleCancel } =
    props;
  const form = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: _toFormData(subProfile),
  });

  const onSubmit = async (formData: FormData) => {
    const subProfile = _toSubProfile(formData);
    const { error } = await handleSubmit(subProfile);
    if (error !== undefined) {
      form.setError("root", { message: error });
    }
  };

  return (
    <div>
      <div className="prose">
        <h1>Edit Dog</h1>
        <p>
          Note that after the first report from a vet has been received, the
          following cannot be edited:
        </p>
        <ul>
          <li>Breed: {dogProfile.dogBreed}</li>
          <li>Gender: {dogProfile.dogGender}</li>
          <li>Birthday: {formatBirthday(dogProfile.dogBirthday)}</li>
          <li>Blood Type: {formatBloodType(dogProfile.dogDea1Point1)}</li>
        </ul>
      </div>
      <BarkForm form={form} onSubmit={onSubmit}>
        <BarkFormInput
          form={form}
          name="dogName"
          label="Dog Name"
          type="text"
        />
        <BarkFormInput
          form={form}
          name="dogWeightKg"
          label="Dog Weight (KG)"
          type="text"
        />
        <BarkFormRadioGroup
          form={form}
          label="Ever Received Blood Transfusion"
          name="dogEverReceivedTransfusion"
          layout="radio"
          options={[
            {
              label: "Yes",
              value: YES_NO_UNKNOWN.YES,
            },
            {
              label: "No",
              value: YES_NO_UNKNOWN.NO,
            },
          ]}
        />
        <BarkFormRadioGroup
          form={form}
          label="Ever Pregnant"
          name="dogEverPregnant"
          layout="radio"
          options={[
            {
              label: "Yes",
              value: YES_NO_UNKNOWN.YES,
            },
            {
              label: "No",
              value: YES_NO_UNKNOWN.NO,
            },
          ]}
        />
        <BarkFormRadioGroup
          form={form}
          label="Preferred Donation Point"
          name="dogPreferredVetId"
          options={vetOptions}
        />
        <BarkFormError form={form} />

        <div className="mt-6 flex flex-col gap-3 md:flex-row-reverse md:justify-end">
          <BarkButton
            className="w-full md:w-40"
            variant="brandInverse"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </BarkButton>
          <BarkButton className="w-full md:w-40" variant="brand" type="submit">
            Save
          </BarkButton>
        </div>
      </BarkForm>
    </div>
  );
}

function _toFormData(subProfile: SubProfileSpec): FormData {
  const { dogWeightKg, ...fields } = subProfile;
  const out: FormData = {
    dogWeightKg: RequiredDogWeightKgField.new().format(dogWeightKg),
    ...fields,
  };
  return FormDataSchema.parse(out);
}

function _toSubProfile(formData: FormData): SubProfileSpec {
  const { dogWeightKg, ...fields } = formData;
  const out: SubProfileSpec = {
    dogWeightKg: RequiredDogWeightKgField.new().parse(dogWeightKg),
    ...fields,
  };
  return SubProfileSpecSchema.parse(out);
}
