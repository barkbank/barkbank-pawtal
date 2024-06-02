import { getAuthenticatedVetActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page(props: { params: { reportId: string } }) {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const { reportId } = props.params;
  return <div>TODO: Stub Page</div>;
}
