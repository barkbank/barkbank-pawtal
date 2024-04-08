"use client";

import {
  BarkForm,
  BarkFormButton,
  BarkFormHeader,
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

const FORM_SCHEMA = z.object({
  userName: z.string().min(1, { message: "Name cannot be empty" }),
  userPhoneNumber: z.string(),
  userResidency: z.string().min(1, { message: "Residency must be specified" }),
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

  async function onSubmit(values: FormDataType) {
    console.log(values);
  }

  const confirmCancellation = () => {
    const value = confirm("Are you sure you want to cancel?");
    if (value === true) {
      router.push(RoutePath.USER_MY_ACCOUNT_PAGE);
    }
  };

  return (
    <>
      <BarkForm onSubmit={onSubmit} form={form}>
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
        <div className="flex gap-2">
          <BarkFormSubmitButton className="h-[60px]">Save</BarkFormSubmitButton>
          <Button
            className="mt-6 inline-block h-[60px]"
            variant={"brandInverse"}
            onClick={confirmCancellation}
          >
            Cancel
          </Button>
        </div>
      </BarkForm>
    </>
  );
}
