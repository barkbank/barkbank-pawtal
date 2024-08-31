import { BarkBackLink } from "@/components/bark/bark-back-link";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { AdminEditController } from "../../_components/admin-edit-controller";

export default async function Page(props: { params: { adminId: string } }) {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const { params } = props;
  const { adminId } = params;
  const { result: account, error } = await actor.getAdminAccountByAdminId({
    adminId,
  });
  if (error !== undefined) {
    return <SimpleErrorPage error={error} />;
  }

  return (
    <div className="m-3 flex flex-col gap-6">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_ADMINS_VIEW(adminId)} />
      <div className="prose">
        <h1>Edit Admin</h1>
        <p>Editing admin account {adminId}</p>
      </div>
      <AdminEditController account={account} />
    </div>
  );
}
