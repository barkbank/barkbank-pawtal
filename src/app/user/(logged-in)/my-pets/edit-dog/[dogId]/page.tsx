import { RoutePath } from "@/lib/route-path";
import APP from "@/lib/app";
import { getVetFormOptions } from "@/app/_lib/get-vet-form-options";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EditDogProfileFormController } from "../../_lib/components/edit-dog-profile-form-controller";
import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { SubProfileFormController } from "../../_lib/components/sub-profile-form-controller";
import { SubProfileSpec } from "@/lib/bark/models/dog-profile-models";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { DogProfileSpec } from "@/lib/bark/models/dog-profile-models";
import { CODE } from "@/lib/utilities/bark-code";
import { toSubProfile } from "@/lib/bark/mappers/to-sub-profile";
import { getDogBreeds } from "@/app/_lib/get-dog-breeds";

export default async function Page(props: { params: { dogId: string } }) {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const { dogId } = props.params;
  const resCount = await actor.getDogReportCount({ dogId });
  if (resCount.error !== undefined) {
    return <SimpleErrorPage error={resCount.error} />;
  }
  const reportCount = resCount.result.numReports;
  const resProfile = await actor.getDogProfile({
    dogId,
  });
  if (resProfile.error !== undefined) {
    return <SimpleErrorPage error={resProfile.error} />;
  }
  const dogProfile = resProfile.result;
  const vetOptions = await APP.getDbPool().then(getVetFormOptions);
  if (reportCount > 0) {
    const resSubProfile = _toSubProfile(dogProfile);
    if (resSubProfile.error !== undefined) {
      return <SimpleErrorPage error={resSubProfile.error} />;
    }
    const subProfile = resSubProfile.result;
    return (
      <div className="m-3">
        <SubProfileFormController
          vetOptions={vetOptions}
          dogId={dogId}
          dogProfile={dogProfile}
          subProfile={subProfile}
        />
      </div>
    );
  }
  const breeds = getDogBreeds();

  return (
    <div className="m-3">
      <EditDogProfileFormController
        vetOptions={vetOptions}
        breeds={breeds}
        dogId={dogId}
        existingDogProfile={dogProfile}
      />
    </div>
  );
}

function _toSubProfile(
  dogProfile: DogProfileSpec,
): Result<SubProfileSpec, typeof CODE.FAILED> {
  try {
    return Ok(toSubProfile(dogProfile));
  } catch (err) {
    console.debug(err);
    return Err(CODE.FAILED);
  }
}
