import { RoutePath } from "@/lib/route-path";
import APP from "@/lib/app";
import { getVetFormOptions } from "@/app/_lib/get-vet-form-options";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDogProfile } from "@/lib/user/actions/get-dog-profile";
import { EditDogProfileFormController } from "../../_lib/components/edit-dog-profile-form-controller";
import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { SubProfileFormController } from "../../_lib/components/sub-profile-form-controller";
import { opFetchDogReportCount } from "@/lib/bark/operations/op-fetch-dog-report-count";

export default async function Page(props: { params: { dogId: string } }) {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const { dogId } = props.params;
  const context = await APP.getBarkContext();
  const { result: reportCount, error: errCount } = await opFetchDogReportCount(
    context,
    { dogId },
  );
  if (errCount !== undefined) {
    return <SimpleErrorPage error={errCount} />;
  }
  const { result: dogProfile, error: errFetch } = await getDogProfile(
    actor,
    dogId,
  );
  if (errFetch !== undefined) {
    return <SimpleErrorPage error={errFetch} />;
  }
  const vetOptions = await APP.getDbPool().then(getVetFormOptions);

  if (reportCount.numReports > 0) {
    return (
      <div className="m-3">
        <SubProfileFormController />
      </div>
    );
  }

  return (
    <div className="m-3">
      <EditDogProfileFormController
        vetOptions={vetOptions}
        dogId={dogId}
        existingDogProfile={dogProfile}
      />
    </div>
  );
}
