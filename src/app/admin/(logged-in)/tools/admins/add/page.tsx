import { BarkBackLink } from "@/components/bark/bark-back-link";
import { RoutePath } from "@/lib/route-path";
import { AdminAddController } from "../_components/admin-add-controller";

export default async function Page() {
  return (
    <div className="m-3 flex flex-col gap-6">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_ADMINS_LIST} />
      <div className="prose">
        <h1>Add Admin</h1>
        <p>Creating a new admin account</p>
      </div>
      <AdminAddController />
    </div>
  );
}
