"use client";

import { BarkButton } from "@/components/bark/bark-button";
import { BarkForm } from "@/components/bark/bark-form";
import { BarkFormCheckboxes } from "@/components/bark/bark-form-checkboxes";
import { BarkFormInput } from "@/components/bark/bark-form-input";
import { BarkFormOption } from "@/components/bark/bark-form-option";
import {
  AdminAccountSpec,
  AdminAccountSpecSchema,
  AdminPermissionsSchema,
  AdminPiiSchema,
  getEmptyAdminPermissionsRecord,
} from "@/lib/bark/models/admin-models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminPermissions } from "@/lib/data/db-models";
import { useRouter } from "next/navigation";

export function AdminForm(props: {
  existing?: AdminAccountSpec | undefined;
  onSubmit: (submission: AdminAccountSpec) => Promise<void>;
  backLinkHref: string;
}) {
  const { existing, onSubmit, backLinkHref } = props;

  const router = useRouter();
  const form = useForm<_FormType>({
    resolver: zodResolver(_FormSchema),
    defaultValues:
      existing !== undefined ? _toFormValue(existing) : _getDefaultFormValue(),
  });
  const permissionOptions: BarkFormOption[] = [
    {
      label: "Manage Admin Accounts",
      value: "adminCanManageAdminAccounts",
    },
    {
      label: "Manage Vet Accounts",
      value: "adminCanManageVetAccounts",
    },
    {
      label: "Manage User Accounts",
      value: "adminCanManageUserAccounts",
    },
    {
      label: "Manage Donors",
      value: "adminCanManageDonors",
    },
  ];
  const onFormSubmit = async (value: _FormType) => {
    const spec = _fromFormValue(value);
    await onSubmit(spec);
  };
  const onFormCancel = () => {
    router.push(backLinkHref);
  };
  return (
    <BarkForm form={form} onSubmit={onFormSubmit}>
      <BarkFormInput form={form} label="Name" name="adminName" />
      <BarkFormInput form={form} label="Email" name="adminEmail" />
      <BarkFormInput form={form} label="Phone" name="adminPhoneNumber" />
      <BarkFormCheckboxes
        form={form}
        label="Permissions"
        name="adminPermissions"
        options={permissionOptions}
      />
      <div className="flex flex-col gap-3 md:flex-row">
        <BarkButton type="submit" variant="default" className="w-full md:w-40">
          Submit
        </BarkButton>
        <BarkButton
          type="button"
          variant="secondary"
          className="w-full md:w-40"
          onClick={onFormCancel}
        >
          Cancel
        </BarkButton>
      </div>
    </BarkForm>
  );
}

const _FormSchema = AdminPiiSchema.merge(
  z.object({
    adminPermissions: z.array(z.string()),
  }),
);

type _FormType = z.infer<typeof _FormSchema>;

function _getDefaultFormValue(): _FormType {
  const out: _FormType = {
    adminName: "",
    adminEmail: "",
    adminPhoneNumber: "",
    adminPermissions: [],
  };
  return out;
}

function _fromFormValue(value: _FormType): AdminAccountSpec {
  const adminPii = AdminPiiSchema.parse(value);
  const { adminPermissions: permissions } = value;
  const adminPermissions = _toAdminPermissions(permissions);
  const out: AdminAccountSpec = { ...adminPii, ...adminPermissions };
  return AdminAccountSpecSchema.parse(out);
}

function _toFormValue(value: AdminAccountSpec): _FormType {
  const validated = AdminAccountSpecSchema.parse(value);
  const adminPii = AdminPiiSchema.parse(validated);
  const perms = AdminPermissionsSchema.parse(validated);
  const adminPermissions = _toPermissionsArray(perms);
  const out: _FormType = { ...adminPii, adminPermissions };
  return _FormSchema.parse(out);
}

function _toPermissionsArray(permissions: AdminPermissions): string[] {
  return Object.keys(permissions).filter(
    (key) => permissions[key as keyof typeof permissions],
  );
}

function _toAdminPermissions(permissions: string[]): AdminPermissions {
  const adminPermissions = getEmptyAdminPermissionsRecord();
  permissions.forEach((permission) => {
    if (adminPermissions.hasOwnProperty(permission)) {
      adminPermissions[permission] = true;
    }
  });
  return AdminPermissionsSchema.parse(adminPermissions);
}
