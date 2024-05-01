"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import { DogProfile } from "@/lib/user/user-models";
import { UTC_DATE_OPTION, parseDateTime } from "@/lib/utilities/bark-time";
import { postDogProfile } from "../_actions/post-dog-profile";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { DogFormData, GeneralDogForm } from "../../_components/general-dog-form";

export default function AddDogForm(props: { vetOptions: BarkFormOption[] }) {
  const router = useRouter();
  const { vetOptions } = props;

  async function handleValues(
    values: DogFormData,
  ): Promise<Result<true, string>> {
    const {
      dogBirthday: dogBirthdayString,
      dogWeightKg: dogWeightKgString,
      ...otherFields
    } = values;
    const dogBirthday = parseDateTime(dogBirthdayString, UTC_DATE_OPTION);
    const dogWeightKg = parseFloat(dogWeightKgString);
    const dogProfile: DogProfile = {
      dogBirthday,
      dogWeightKg,
      ...otherFields,
    };
    const { error } = await postDogProfile(dogProfile);
    if (error === CODE.ERROR_NOT_LOGGED_IN) {
      router.push(RoutePath.USER_LOGIN_PAGE);
      return Err(error);
    }
    if (error !== undefined) {
      return Err(error);
    }
    router.push(RoutePath.USER_MY_PETS);
    return Ok(true);
  }

  async function handleCancel() {
    router.push(RoutePath.USER_MY_PETS);
  }

  return (
    <GeneralDogForm
      formTitle="Add Dog"
      vetOptions={vetOptions}
      handleSubmit={handleValues}
      handleCancel={handleCancel}
    />
  );
}
