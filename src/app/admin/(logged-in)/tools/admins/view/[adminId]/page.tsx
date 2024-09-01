import { BarkBackLink } from "@/components/bark/bark-back-link";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { BarkButton } from "@/components/bark/bark-button";
import { AdminAccountView } from "../../_components/admin-account-view";

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
      <BarkBackLink
        href={RoutePath.ADMIN_TOOLS_ADMINS_LIST}
        text="Back to list"
      />
      <AdminAccountView account={account} />
      <div className="flex flex-col gap-3 md:flex-row">
        <BarkButton
          className="w-full md:w-40"
          variant="secondary"
          href={RoutePath.ADMIN_TOOLS_ADMINS_EDIT(adminId)}
        >
          Edit
        </BarkButton>
        <BarkButton
          className="w-full md:w-40"
          variant="secondary"
          href={RoutePath.ADMIN_TOOLS_ADMINS_DELETE(adminId)}
        >
          Delete
        </BarkButton>
      </div>
    </div>
  );
}
