"use client";

import { AdminAccountSpec } from "@/lib/bark/models/admin-models";

export function AdminForm(props: {
  existing?: AdminAccountSpec | undefined;
  onSubmit: (submission: AdminAccountSpec) => Promise<void>;
}) {
  return <div>WIP: Implement an admin form</div>;
}
