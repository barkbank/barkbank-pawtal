"use client";

import { BarkForm } from "@/components/bark/bark-form";
import { BarkFormParagraph } from "@/components/bark/bark-form-typography";
import { BarkFormError } from "@/components/bark/bark-form-error";
import { BarkFormInput } from "@/components/bark/bark-form-input";
import { BarkFormRadioGroup } from "@/components/bark/bark-form-radio-group";
import { BarkFormOption } from "@/components/bark/bark-form-option";
import { DOG_ANTIGEN_PRESENCE } from "@/lib/bark/enums/dog-antigen-presence";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BarkButton } from "@/components/bark/bark-button";
import { BarkH1 } from "@/components/bark/bark-typography";
import { Result } from "@/lib/utilities/result";
import { DogProfileSpec } from "@/lib/bark/models/dog-profile-models";
import { RequiredDateField } from "@/app/_lib/field-schemas/required-date-field";
import { OptionalDogWeightKgField } from "@/app/_lib/field-schemas/optional-dog-weight-kg-field";
import { useEffect } from "react";
import { BarkFormAutocomplete } from "@/components/bark/bark-form-autocomplete";

const FORM_SCHEMA = z.object({
  dogName: z.string().min(1, { message: "Name cannot be empty" }),
  dogBreed: z.string(),
  dogBirthday: RequiredDateField.new().schema(),
  dogGender: z.nativeEnum(DOG_GENDER),
  dogWeightKg: OptionalDogWeightKgField.new().schema(),
  dogDea1Point1: z.nativeEnum(DOG_ANTIGEN_PRESENCE),
  dogEverReceivedTransfusion: z.nativeEnum(YES_NO_UNKNOWN),
  dogEverPregnant: z.nativeEnum(YES_NO_UNKNOWN),
  dogPreferredVetId: z.string(),
});

type DogFormData = z.infer<typeof FORM_SCHEMA>;

const EMPTY_VALUES: Partial<DogFormData> = {
  dogName: "",
  dogBreed: "",
  dogBirthday: "",
  dogWeightKg: "",
  dogPreferredVetId: "",
};

function toDogFormData(dogProfile: DogProfileSpec): DogFormData {
  const { dogBirthday, dogWeightKg, ...otherFields } = dogProfile;
  const dogBirthdayString = RequiredDateField.new().format(dogBirthday);
  const dogWeightKgString = OptionalDogWeightKgField.new().format(dogWeightKg);
  const dogFormData: DogFormData = {
    dogBirthday: dogBirthdayString,
    dogWeightKg: dogWeightKgString,
    ...otherFields,
  };
  return dogFormData;
}

function toDogProfile(dogFormData: DogFormData): DogProfileSpec {
  const {
    dogBirthday: dogBirthdayString,
    dogWeightKg: dogWeightKgString,
    ...otherFields
  } = dogFormData;
  const dogBirthday = RequiredDateField.new().parse(dogBirthdayString);
  const dogWeightKg = OptionalDogWeightKgField.new().parse(dogWeightKgString);
  const dogProfile: DogProfileSpec = {
    dogBirthday,
    dogWeightKg,
    ...otherFields,
  };
  return dogProfile;
}

export function GeneralDogForm(props: {
  formTitle: string;
  vetOptions: BarkFormOption[];
  breeds: string[];
  prefillData?: DogProfileSpec;
  handleSubmit: (dogProfile: DogProfileSpec) => Promise<Result<true, string>>;
  handleCancel: () => Promise<void>;
}) {
  const {
    formTitle,
    vetOptions,
    breeds,
    prefillData,
    handleSubmit,
    handleCancel,
  } = props;
  const prefillFormValues = prefillData
    ? toDogFormData(prefillData)
    : undefined;
  const form = useForm<DogFormData>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: { ...EMPTY_VALUES, ...prefillFormValues },
  });

  async function onSubmit(values: DogFormData) {
    const dogProfile = toDogProfile(values);
    const { error } = await handleSubmit(dogProfile);
    if (error !== undefined) {
      // TODO: The GeneralDogForm needs to specify the specifc types of errors
      // because it is responsible for how the errors need to be displayed.
      form.setError("root", { message: error });
    }
  }

  const currentValues = form.watch();
  const { dogGender, dogBreed } = currentValues;
  useEffect(() => {
    if (dogGender === DOG_GENDER.MALE) {
      form.setValue("dogEverPregnant", YES_NO_UNKNOWN.NO);
    }
  }, [dogGender, form]);

  return (
    <div>
      <BarkH1>{formTitle}</BarkH1>
      <BarkFormParagraph>
        Please fill in the required information.
      </BarkFormParagraph>
      <BarkForm onSubmit={onSubmit} form={form}>
        <BarkFormInput form={form} label="Dog Name" name="dogName" />

        <BarkFormAutocomplete
          form={form}
          label="Dog Breed"
          name="dogBreed"
          suggestions={breeds}
          value={dogBreed}
        />

        <BarkFormInput
          form={form}
          label="Dog Birthday"
          name="dogBirthday"
          placeholder="DD MMM YYYY"
          description="Please enter a date in DD MMM YYYY format. E.g. 28 Apr 2022. It is okay to provide an approximate date."
        />

        <BarkFormRadioGroup
          form={form}
          label="Dog Gender"
          name="dogGender"
          layout="radio"
          options={[
            { label: "Male", value: DOG_GENDER.MALE },
            { label: "Female", value: DOG_GENDER.FEMALE },
          ]}
        />

        <BarkFormInput
          form={form}
          label="Dog Weight"
          description="Specify weight in kilograms. E.g. 23.4"
          name="dogWeightKg"
          type="text"
        />

        <BarkFormRadioGroup
          form={form}
          label="Dog Blood Type"
          name="dogDea1Point1"
          options={[
            {
              label: "I don't know",
              value: DOG_ANTIGEN_PRESENCE.UNKNOWN,
            },
            {
              label: "DEA 1 Positive",
              value: DOG_ANTIGEN_PRESENCE.POSITIVE,
            },
            {
              label: "DEA 1 Negative",
              value: DOG_ANTIGEN_PRESENCE.NEGATIVE,
            },
          ]}
        />

        <BarkFormRadioGroup
          form={form}
          label="Ever Received Blood Transfusion"
          name="dogEverReceivedTransfusion"
          layout="radio"
          options={[
            {
              label: "I don't know",
              value: YES_NO_UNKNOWN.UNKNOWN,
            },
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
          disabled={dogGender === DOG_GENDER.MALE}
          options={[
            {
              label: "I don't know",
              value: YES_NO_UNKNOWN.UNKNOWN,
            },
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

        {vetOptions.length > 0 && (
          <BarkFormRadioGroup
            form={form}
            label="Preferred Vet"
            name="dogPreferredVetId"
            options={vetOptions}
          />
        )}

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
