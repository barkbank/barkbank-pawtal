"use server";

import { RoutePath } from "@/lib/route-path";
import EditDogProfileForm from "./_components/edit-dog-profile-form";
import APP from "@/lib/app";
import { getVetFormOptions } from "@/app/_lib/get-vet-form-options";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDogProfile } from "@/lib/user/actions/get-dog-profile";

export default async function Page(props: { params: { dogId: string } }) {
  const {
    params: { dogId },
  } = props;

  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const { result: existingDogProfile, error } = await getDogProfile(
    actor,
    dogId,
  );
  if (error) {
    redirect(RoutePath.USER_MY_PETS);
  }

  const vetOptions = await APP.getDbPool().then(getVetFormOptions);

  return (
    <div className="m-3">
      <EditDogProfileForm
        vetOptions={vetOptions}
        dogId={dogId}
        existingDogProfile={existingDogProfile}
      />
    </div>
  );
}
