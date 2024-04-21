"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import GeneralDogForm, {
  DogFormData,
} from "../../_components/general-dog-form";
import { DogProfile } from "@/lib/user/user-models";
import { UTC_DATE_OPTION, parseDateTime } from "@/lib/utilities/bark-time";
import { submitDog } from "../_actions/submit-dog";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { Err, Ok, Result } from "@/lib/utilities/result";

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
    const { error } = await submitDog(dogProfile);
    if (error !== undefined) {
      if (error === "ERROR_UNAUTHORIZED") {
        router.push(RoutePath.USER_LOGIN_PAGE);
      }
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
