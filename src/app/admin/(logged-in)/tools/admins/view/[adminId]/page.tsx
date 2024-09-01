import { BarkBackLink } from "@/components/bark/bark-back-link";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarkButton } from "@/components/bark/bark-button";

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
  const {
    adminName,
    adminEmail,
    adminPhoneNumber,
    adminCanManageAdminAccounts,
    adminCanManageVetAccounts,
    adminCanManageUserAccounts,
    adminCanManageDonors,
  } = account;

  return (
    <div className="m-3 flex flex-col gap-6">
      <BarkBackLink
        href={RoutePath.ADMIN_TOOLS_ADMINS_LIST}
        text="Back to list"
      />
      <div className="prose">
        <h1>{adminName}</h1>
        <p>Account ID: {adminId}</p>
        <p>Email: {adminEmail}</p>
        <p>Phone: {adminPhoneNumber}</p>
        <h2>Permissions</h2>
        <ul>
          <_Permission
            label="manage admin accounts"
            value={adminCanManageAdminAccounts}
          />
          <_Permission
            label="manage vet accounts"
            value={adminCanManageVetAccounts}
          />
          <_Permission
            label="manage user accounts"
            value={adminCanManageUserAccounts}
          />
          <_Permission label="manage donors" value={adminCanManageDonors} />
        </ul>
      </div>
      <div>
        <BarkButton
          className="w-full md:w-40"
          variant="default"
          href={RoutePath.ADMIN_TOOLS_ADMINS_EDIT(adminId)}
        >
          Edit
        </BarkButton>
      </div>
    </div>
  );
}

function _Permission(props: { label: string; value: boolean }) {
  const { label, value } = props;
  if (value) {
    return (
      <li>
        <b>Can {label}</b>
      </li>
    );
  }
  return <li>Cannot {label}</li>;
}
