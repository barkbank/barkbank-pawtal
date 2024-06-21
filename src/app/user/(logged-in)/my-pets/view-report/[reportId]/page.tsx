import APP from "@/lib/app";
import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page(props: { params: { reportId: string } }) {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const actorUserId = actor.getUserId();
  const { reportId } = props.params;
  const context = await APP.getBarkContext();
  // TODO: opFetchReport needs to be able to receive actor user ID
  // const {result, error} = await opFetchReport(context, {reportId, actorUserId});

  return (
    <div className="prose m-3">
      <h1>Stub page for viewing reports</h1>
      <p>The report ID is {reportId}.</p>
    </div>
  );
}
