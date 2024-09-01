"use client";

import { AdminAccountSpec } from "@/lib/bark/models/admin-models";
import { AdminForm } from "./admin-form";
import { RoutePath } from "@/lib/route-path";

export function AdminAddController() {
  const onSubmit = async (submission: AdminAccountSpec) => {
    console.log({ submission });
    // WIP: This function will create a new admin account
  };

  return (
    <AdminForm
      onSubmit={onSubmit}
      backLinkHref={RoutePath.ADMIN_TOOLS_ADMINS_LIST}
    />
  );
}
