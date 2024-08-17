"use client";

import { BarkForm } from "@/components/bark/bark-form";
import { BarkFormInput } from "@/components/bark/bark-form-input";
import { BarkFormRadioGroup } from "@/components/bark/bark-form-radio-group";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { RoutePath } from "@/lib/route-path";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { postMyAccountDetails } from "../_actions/post-my-account-details";
import React from "react";
import { BarkButton } from "@/components/bark/bark-button";
import { CODE } from "@/lib/utilities/bark-code";
import {
  UserAccountUpdate,
  UserAccountUpdateSchema,
} from "@/lib/bark/models/user-models";
import { BarkFormSelect } from "@/components/bark/bark-form-select";
import { BarkFormOption } from "@/components/bark/bark-form-option";
import { USER_TITLE } from "@/lib/bark/enums/user-title";

export default function AccountEditForm(props: {
  existing: UserAccountUpdate;
}) {
  const { existing } = props;
  const router = useRouter();
  const form = useForm<UserAccountUpdate>({
    resolver: zodResolver(UserAccountUpdateSchema),
    defaultValues: existing,
  });
  const [updateError, setUpdateError] = React.useState("");

  async function onSubmit(values: UserAccountUpdate) {
    setUpdateError("");
    const request: UserAccountUpdate = values;

    const response = await postMyAccountDetails(request);
    if (response === CODE.ERROR_NOT_LOGGED_IN) {
      router.push(RoutePath.USER_LOGIN_PAGE);
      return;
    }
    if (response === CODE.OK) {
      router.push(RoutePath.USER_MY_ACCOUNT_PAGE);
      return;
    }
    setUpdateError("Failed to update account details");
  }

  const titleOptions: BarkFormOption[] = [
    { label: "Mr", value: USER_TITLE.MR },
    { label: "Ms", value: USER_TITLE.MS },
    { label: "Mrs", value: USER_TITLE.MRS },
    { label: "Mdm", value: USER_TITLE.MDM },
    { label: "Prefer not to say", value: USER_TITLE.PREFER_NOT_TO_SAY },
  ];

  return (
    <>
      <BarkForm onSubmit={onSubmit} form={form}>
        <BarkFormSelect
          form={form}
          label="My Title"
          name="userTitle"
          options={titleOptions}
          placeholder="-- Select --"
        />
        <BarkFormInput form={form} label="My Name" name="userName" />
        <BarkFormInput
          form={form}
          label="My Phone Number"
          name={"userPhoneNumber"}
        />
        <BarkFormRadioGroup
          form={form}
          label="Are you currently based in Singapore?"
          name="userResidency"
          options={[
            { label: "Yes", value: USER_RESIDENCY.SINGAPORE },
            { label: "No", value: USER_RESIDENCY.OTHER },
          ]}
        />
        <div className="mt-6 flex flex-col gap-2 md:flex-row">
          <BarkButton variant="brand" className="w-full md:w-40" type="submit">
            Save
          </BarkButton>
          <BarkButton
            className="inline-block h-[60px] w-full md:w-40"
            variant={"brandInverse"}
            type="button"
            onClick={async () => router.push(RoutePath.USER_MY_ACCOUNT_PAGE)}
          >
            Cancel
          </BarkButton>
          {updateError && <div className="text-red-500">{updateError}</div>}
        </div>
      </BarkForm>
    </>
  );
}
