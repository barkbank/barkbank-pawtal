"use client";

import { AdminAccountSpec } from "@/lib/bark/models/admin-models";
import { AdminForm } from "./admin-form";
import { RoutePath } from "@/lib/route-path";
import { postCreateAdmin } from "../_lib/post-create-admin";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function AdminAddController() {
  const { toast } = useToast();
  const router = useRouter();
  const onSubmit = async (submission: AdminAccountSpec) => {
    console.log({ submission });
    const { result, error } = await postCreateAdmin({ spec: submission });
    if (error !== undefined) {
      toast({ variant: "destructive", title: "Error", description: error });
      return;
    }
    const { adminId } = result;
    toast({ variant: "default", title: "Created Admin Account" });
    router.push(RoutePath.ADMIN_TOOLS_ADMINS_VIEW(adminId));
  };

  return (
    <AdminForm
      onSubmit={onSubmit}
      backLinkHref={RoutePath.ADMIN_TOOLS_ADMINS_LIST}
    />
  );
}
