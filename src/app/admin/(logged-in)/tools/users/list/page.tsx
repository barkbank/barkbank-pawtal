import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { BarkBackLink } from "@/components/bark/bark-back-link";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { formatDateTime, SGT_UI_DATE_TIME } from "@/lib/utilities/bark-time";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const res = await actor.getAllUserAccounts();
  if (res.error !== undefined) {
    return <SimpleErrorPage error={res.error} />;
  }
  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_PAGE} />
      <div className="prose">
        <h1>Users</h1>
        <p>A tool for managing user accounts.</p>
      </div>
      <div className="flex flex-col gap-3">
        {res.result.map((user) => {
          const { userId, userName, userCreationTime } = user;
          const formattedTime = formatDateTime(
            userCreationTime,
            SGT_UI_DATE_TIME,
          );
          return (
            <Link
              key={userId}
              className="x-card x-card-bg"
              href={RoutePath.ADMIN_TOOLS_USERS_VIEW(userId)}
            >
              <p>User ID: {userId}</p>
              <p>User Name: {userName}</p>
              <p>User Creation Time: {formattedTime}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
