import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { AdminDeleteController } from "../../_components/admin-delete-controller";

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

  return <AdminDeleteController account={account} />;
}
