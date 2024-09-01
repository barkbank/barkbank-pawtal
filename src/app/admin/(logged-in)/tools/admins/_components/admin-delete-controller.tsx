"use client";

import { BarkBackLink } from "@/components/bark/bark-back-link";
import { AdminAccount } from "@/lib/bark/models/admin-models";
import { AdminAccountView } from "./admin-account-view";
import { RoutePath } from "@/lib/route-path";
import { BarkButton } from "@/components/bark/bark-button";
import { postDeleteAdmin } from "../_lib/post-delete-admin";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CODE } from "@/lib/utilities/bark-code";

export function AdminDeleteController(props: { account: AdminAccount }) {
  const { account } = props;
  const { adminId } = account;
  const { toast } = useToast();
  const router = useRouter();
  const onDeleteConfirmed = async () => {
    const res = await postDeleteAdmin({ adminId });
    if (res !== CODE.OK) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error: ${res}`,
      });
      return;
    }
    toast({ variant: "default", title: "Admin Account Deleted" });
    router.push(RoutePath.ADMIN_TOOLS_ADMINS_LIST);
  };
  return (
    <div className="m-3 flex flex-col gap-6">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_ADMINS_VIEW(adminId)} />
      <AdminAccountView account={account} />
      <div className="prose">
        <h3>Please confirm deletion of this admin account</h3>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <BarkButton
          className="w-full md:w-40"
          variant="default"
          href={RoutePath.ADMIN_TOOLS_ADMINS_VIEW(adminId)}
        >
          Cancel
        </BarkButton>
        <BarkButton
          className="w-full md:w-40"
          variant="destructive"
          onClick={onDeleteConfirmed}
          type="button"
        >
          Confirm Delete
        </BarkButton>
      </div>
    </div>
  );
}
