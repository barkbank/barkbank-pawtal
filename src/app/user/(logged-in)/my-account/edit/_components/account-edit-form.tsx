"use client";

import {
  BarkForm,
  BarkFormInput,
  BarkFormRadioGroup,
  BarkFormSubmitButton,
} from "@/components/bark/bark-form";
import { Button } from "@/components/ui/button";
import { USER_RESIDENCY } from "@/lib/data/db-enums";
import { RoutePath } from "@/lib/route-path";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateAccountDetails } from "../_action/update-my-account-details";
import { MyAccountDetailsUpdate } from "@/lib/user/user-models";
import React from "react";
import { BarkButton } from "@/components/bark/bark-button";

const FORM_SCHEMA = z.object({
  userName: z.string().min(1, { message: "Name cannot be empty" }),
  userPhoneNumber: z.string(),
  userEmail: z.string(),
  userResidency: z.nativeEnum(USER_RESIDENCY),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function AccountEditForm(props: {
  defaultValues: FormDataType;
}) {
  const router = useRouter();
  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: props.defaultValues,
  });
  const [updateStatus, setUpdateStatus] = React.useState("");

  async function saveUser(values: FormDataType) {
    setUpdateStatus("");
    const request = values as MyAccountDetailsUpdate;

    const response = await updateAccountDetails(request);
    if (response === "STATUS_204_UPDATED") {
      router.push(RoutePath.USER_MY_ACCOUNT_PAGE);
      return;
    }
    setUpdateStatus("Failed to update account details");
  }

  return (
    <>
      <BarkForm onSubmit={saveUser} form={form}>
        <BarkFormInput form={form} label="My Name" name={"userName"} />
        <BarkFormInput
          form={form}
          label="My Phone Number"
          name={"userPhoneNumber"}
          placeholder="+65"
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
          {updateStatus && <div className="text-red-500">{updateStatus}</div>}
        </div>
      </BarkForm>
    </>
  );
}
