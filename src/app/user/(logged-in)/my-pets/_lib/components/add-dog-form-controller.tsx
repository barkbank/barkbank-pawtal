"use client";

import { BarkFormOption } from "@/components/bark/bark-form-option";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import { postDogProfile } from "../actions/post-dog-profile";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { GeneralDogForm } from "./general-dog-form";
import { useToast } from "@/components/ui/use-toast";
import { MINIMUM_TOAST_MILLIS } from "@/app/_lib/constants";
import { asyncSleep } from "@/lib/utilities/async-sleep";

export default function AddDogFormController(props: {
  vetOptions: BarkFormOption[];
  breeds: string[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { vetOptions, breeds } = props;

  async function handleValues(
    dogProfile: DogProfile,
  ): Promise<Result<true, string>> {
    const { dogName } = dogProfile;
    toast({
      title: "Adding...",
      description: `Profile for ${dogName} is being added.`,
      variant: "brandInfo",
    });

    const [{ error }, _] = await Promise.all([
      postDogProfile(dogProfile),
      asyncSleep(MINIMUM_TOAST_MILLIS),
    ]);

    if (error === CODE.ERROR_NOT_LOGGED_IN) {
      router.push(RoutePath.USER_LOGIN_PAGE);
      return Err(error);
    }
    if (error !== undefined) {
      return Err(error);
    }
    toast({
      title: "Added!",
      description: `Profile for ${dogName} has been added.`,
      variant: "brandSuccess",
    });
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
      breeds={breeds}
      handleSubmit={handleValues}
      handleCancel={handleCancel}
    />
  );
}
