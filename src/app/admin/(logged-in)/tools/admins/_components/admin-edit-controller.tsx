"use client";

import {
  AdminAccount,
  AdminAccountSpec,
  AdminAccountSpecSchema,
} from "@/lib/bark/models/admin-models";
import { AdminForm } from "./admin-form";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { useToast } from "@/components/ui/use-toast";
import { postUpdateAdmin } from "../_lib/post-update-admin";
import { CODE } from "@/lib/utilities/bark-code";

export function AdminEditController(props: { account: AdminAccount }) {
  const { toast } = useToast();
  const router = useRouter();

  const { account } = props;
  const existing = AdminAccountSpecSchema.parse(account);
  const { adminId } = account;

  const onSubmit = async (submission: AdminAccountSpec) => {
    console.log({ submission });
    const res = await postUpdateAdmin({ adminId, spec: submission });
    if (res !== CODE.OK) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error: ${res}`,
      });
      return;
    }
    toast({ variant: "default", title: "Updated Admin Account" });
    router.push(RoutePath.ADMIN_TOOLS_ADMINS_VIEW(adminId));
  };

  return (
    <AdminForm
      existing={existing}
      onSubmit={onSubmit}
      backLinkHref={RoutePath.ADMIN_TOOLS_ADMINS_VIEW(adminId)}
    />
  );
}
