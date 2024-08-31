"use client";

import {
  AdminAccount,
  AdminAccountSpec,
  AdminAccountSpecSchema,
} from "@/lib/bark/models/admin-models";
import { AdminForm } from "./admin-form";

export function AdminEditController(props: { account: AdminAccount }) {
  const { account } = props;
  const existing = AdminAccountSpecSchema.parse(account);

  const onSubmit = async (submission: AdminAccountSpec) => {
    console.log({ submission });
    // WIP: This function will submit an update to the admin account.
  };

  return <AdminForm existing={existing} onSubmit={onSubmit} />;
}
