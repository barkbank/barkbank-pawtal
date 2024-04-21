"use client";

import {
  BarkForm,
  BarkFormInput,
  BarkFormRadioGroup,
} from "@/components/bark/bark-form";
import { USER_RESIDENCY, UserResidency } from "@/lib/data/db-enums";
import { RoutePath } from "@/lib/route-path";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateAccountDetails } from "../_action/update-my-account-details";
import { MyAccountDetailsUpdate } from "@/lib/user/user-models";
import React, { ButtonHTMLAttributes } from "react";
import { BarkButton } from "@/components/bark/bark-button";

const FORM_SCHEMA = z.object({
  userName: z.string().min(1, { message: "Name cannot be empty" }),
  userPhoneNumber: z.string(),
  userResidency: z.nativeEnum(USER_RESIDENCY),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function AccountEditForm({
  userName,
  userPhoneNumber,
  userResidency,
}: {
  userName: string;
  userPhoneNumber: string;
  userResidency: UserResidency;
}) {
  const router = useRouter();
  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      userName,
      userPhoneNumber,
      userResidency,
    },
  });
  const [updateError, setUpdateError] = React.useState("");

  async function saveUser(values: FormDataType) {
    setUpdateError("");
    const request: MyAccountDetailsUpdate = values;

    const response = await updateAccountDetails(request);
    if (response === "STATUS_204_UPDATED") {
      router.push(RoutePath.USER_MY_ACCOUNT_PAGE);
      return;
    }
    setUpdateError("Failed to update account details");
  }

  return (
    <>
      <BarkForm onSubmit={saveUser} form={form}>
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
        <div className="mt-6 flex gap-2">
          <BarkButton variant="brand">Save</BarkButton>
          <BarkButton
            className="inline-block h-[60px]"
            variant={"brandInverse"}
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
