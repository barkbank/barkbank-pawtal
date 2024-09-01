"use client";

import {
  AdminAccount,
  AdminAccountSpec,
  AdminAccountSpecSchema,
} from "@/lib/bark/models/admin-models";
import { AdminForm } from "./admin-form";
import { usePathname } from "next/navigation";
import { RoutePath } from "@/lib/route-path";

export function AdminEditController(props: { account: AdminAccount }) {
  const { account } = props;
  const existing = AdminAccountSpecSchema.parse(account);
  const { adminId } = account;

  const onSubmit = async (submission: AdminAccountSpec) => {
    console.log({ submission });
    // WIP: This function will submit an update to the admin account.
  };

  return (
    <AdminForm
      existing={existing}
      onSubmit={onSubmit}
      backLinkHref={RoutePath.ADMIN_TOOLS_ADMINS_VIEW(adminId)}
    />
  );
}
