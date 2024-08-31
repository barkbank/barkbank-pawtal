import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { BarkBackLink } from "@/components/bark/bark-back-link";
import { Button } from "@/components/ui/button";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { AdminAccount } from "@/lib/bark/models/admin-models";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    redirect(RoutePath.ADMIN_LOGIN_PAGE);
  }
  const { result: adminAccounts, error } = await actor.getAllAdminAccounts();
  if (error !== undefined) {
    return <SimpleErrorPage error={error} />;
  }
  return (
    <div className="m-3 flex flex-col gap-6">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_PAGE} />
      <div className="prose">
        <h1>Admin Management</h1>
        <p>A tool for managing admin accounts.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {adminAccounts.map((account) => (
          <_AdminCard account={account} key={account.adminId} />
        ))}
      </div>
      <div>
        <Link href={RoutePath.ADMIN_TOOLS_ADMINS_ADD}>
          <Button className="w-full p-6 md:w-40">Add</Button>
        </Link>
      </div>
    </div>
  );
}

function _AdminCard(props: { account: AdminAccount }) {
  const { account } = props;
  const { adminId, adminName, adminEmail, adminPhoneNumber } = account;
  return (
    <Link
      className="x-card x-card-bg flex flex-col gap-1 text-sm"
      href={RoutePath.ADMIN_TOOLS_ADMINS_EDIT(adminId)}
    >
      <p className="font-semibold">{adminName}</p>
      <p>Email: {adminEmail}</p>
      <p>Tel: {adminPhoneNumber}</p>
    </Link>
  );
}
