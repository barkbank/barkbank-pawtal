"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import { DogProfile } from "@/lib/dog/dog-models";
import {
  UTC_DATE_OPTION,
  formatDateTime,
  parseDateTime,
} from "@/lib/utilities/bark-time";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { postDogProfileUpdate } from "../_actions/post-dog-profile-update";
import { CODE } from "@/lib/utilities/bark-code";
import {
  DogFormData,
  GeneralDogForm,
} from "../../../_components/general-dog-form";

export default function EditDogProfileForm(props: {
  vetOptions: BarkFormOption[];
  dogId: string;
  existingDogProfile: DogProfile;
}) {
  const router = useRouter();
  const { vetOptions, dogId, existingDogProfile } = props;

  async function handleValues(
    values: DogFormData,
  ): Promise<Result<true, string>> {
    const dogProfile = toDogProfile(values);
    const res = await postDogProfileUpdate({ dogId, dogProfile });
    if (res === CODE.ERROR_NOT_LOGGED_IN) {
      router.push(RoutePath.USER_LOGIN_PAGE);
      return Err(res);
    }
    if (res !== CODE.OK) {
      return Err(res);
    }
    router.back();
    return Ok(true);
  }

  async function handleCancel() {
    router.back();
  }

  const prefillData = toDogFormData(existingDogProfile);

  return (
    <GeneralDogForm
      formTitle="Edit Dog"
      vetOptions={vetOptions}
      handleSubmit={handleValues}
      handleCancel={handleCancel}
      prefillData={prefillData}
    />
  );
}

function toDogFormData(dogProfile: DogProfile): DogFormData {
  const { dogBirthday, dogWeightKg, ...otherFields } = dogProfile;
  const dogBirthdayString = formatDateTime(dogBirthday, UTC_DATE_OPTION);
  const dogWeightKgString = dogWeightKg !== null ? dogWeightKg.toString() : "";
  const dogFormData: DogFormData = {
    dogBirthday: dogBirthdayString,
    dogWeightKg: dogWeightKgString,
    ...otherFields,
  };
  return dogFormData;
}

function toDogProfile(dogFormData: DogFormData): DogProfile {
  const {
    dogBirthday: dogBirthdayString,
    dogWeightKg: dogWeightKgString,
    ...otherFields
  } = dogFormData;
  const dogBirthday = parseDateTime(dogBirthdayString, UTC_DATE_OPTION);
  const dogWeightKg = parseFloat(dogWeightKgString);
  const dogProfile: DogProfile = {
    dogBirthday,
    dogWeightKg,
    ...otherFields,
  };
  return dogProfile;
}
