"use client";

import { BarkFormOption } from "@/components/bark/bark-form";
import { SubProfileForm } from "./sub-profile-form";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import { SubProfile } from "@/lib/bark/models/sub-profile";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";

export function SubProfileFormController(props: {
  vetOptions: BarkFormOption[];
  dogId: string;
  dogProfile: DogProfile;
  subProfile: SubProfile;
}) {
  const { vetOptions, dogId, dogProfile, subProfile } = props;
  const router = useRouter();

  const onCancel = async () => {
    router.push(RoutePath.USER_VIEW_DOG(dogId));
  };

  const onSubmit = async (
    subProfile: SubProfile,
  ): Promise<Result<true, string>> => {
    console.log({
      _msg: "onSubmit was triggered",
      subProfile,
    });
    return Err(CODE.ERROR_NOT_IMPLEMENTED);
  };

  return (
    <SubProfileForm
      vetOptions={vetOptions}
      dogProfile={dogProfile}
      subProfile={subProfile}
      handleCancel={onCancel}
      handleSubmit={onSubmit}
    />
  );
}
