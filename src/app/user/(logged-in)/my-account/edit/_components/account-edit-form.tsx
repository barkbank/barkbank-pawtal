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
import { postMyAccountDetails } from "../_action/post-my-account-details";
import { MyAccountDetailsUpdate } from "@/lib/user/user-models";
import React from "react";
import { BarkButton } from "@/components/bark/bark-button";
import { CODE } from "@/lib/utilities/bark-code";

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

    const response = await postMyAccountDetails(request);
    if (response === CODE.OK) {
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
        <div className="mt-6 flex flex-col gap-2 md:flex-row">
          <BarkButton variant="brand" className="w-full md:w-40">
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
