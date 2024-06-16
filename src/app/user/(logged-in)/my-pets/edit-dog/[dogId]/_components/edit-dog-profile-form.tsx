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
import { useToast } from "@/components/ui/use-toast";
import { MINIMUM_TOAST_MILLIS } from "@/app/_lib/toast-delay";
import { asyncSleep } from "@/lib/utilities/async-sleep";

export default function EditDogProfileForm(props: {
  vetOptions: BarkFormOption[];
  dogId: string;
  existingDogProfile: DogProfile;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { vetOptions, dogId, existingDogProfile } = props;

  async function handleValues(
    values: DogFormData,
  ): Promise<Result<true, string>> {
    const dogProfile = toDogProfile(values);
    const { dogName } = dogProfile;

    toast({
      title: "Saving...",
      description: `Profile for ${dogName} is being saved.`,
      variant: "brandInfo",
    });
    const [res, _] = await Promise.all([
      postDogProfileUpdate({ dogId, dogProfile }),
      asyncSleep(MINIMUM_TOAST_MILLIS),
    ]);
    if (res === CODE.ERROR_NOT_LOGGED_IN) {
      router.push(RoutePath.USER_LOGIN_PAGE);
      return Err(res);
    }
    if (res !== CODE.OK) {
      return Err(res);
    }
    toast({
      title: "Saved!",
      description: `Profile for ${dogName} has been saved.`,
      variant: "brandSuccess",
    });
    // TODO: do not use router.back(). It may go to the wrong place. Think of another solution.
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

// WIP: Move toDogFormData and toDogProfile into GeneralDogForm so the IO for GeneralDogForm is in terms of DogProfile.
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
