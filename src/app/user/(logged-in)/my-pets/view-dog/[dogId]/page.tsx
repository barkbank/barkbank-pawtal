import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page(props: { params: { dogId: string } }) {
  const {
    params: { dogId },
  } = props;

  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  return (
    <div className="m-3">
      <p>View Dog {dogId}</p>
    </div>
  )
}
