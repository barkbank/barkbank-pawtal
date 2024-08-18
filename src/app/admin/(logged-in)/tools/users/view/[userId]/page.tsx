import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { BarkBackLink } from "@/components/bark/bark-back-link";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { formatDateTime, SGT_UI_DATE_TIME } from "@/lib/utilities/bark-time";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page(props: { params: { userId: string } }) {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const { userId } = props.params;
  const res = await actor.getUserAccountByUserId({ userId });
  if (res.error !== undefined) {
    return <SimpleErrorPage error={res.error} />;
  }
  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_USERS_LIST} />
      <div className="prose">
        <h1>User #{userId}</h1>
        <pre>{JSON.stringify(res.result, null, 2)}</pre>
      </div>
    </div>
  );
}
