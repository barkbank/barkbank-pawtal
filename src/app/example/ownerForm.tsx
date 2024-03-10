"use client";

import {
  BarkForm,
  BarkFormButton,
  BarkFormHeader,
  BarkFormInput,
  BarkFormRadioGroup,
  BarkFormSingleCheckbox,
  BarkFormSubmitButton,
} from "@/components/bark/bark-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FORM_SCHEMA = z.object({
  name: z.string(),
  mobile: z.string(),
  email: z.string().email(),
  "country-based": z.string(),
  "terms-and-conditions": z.boolean().refine((value) => value === true, {
    message: "You must accept the disclaimer to proceed",
  }),
  "otp-verified": z.boolean().refine((value) => value === true, {
    message: "You must verify your OTP to proceed",
  }),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function OwnerForm({
  onSubmitForm,
}: {
  onSubmitForm: (values: FormDataType) => void;
}) {
  const [otpSent, setOtpSent] = React.useState(false);
  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
  });

  async function onSubmit(values: FormDataType) {
    // ! Send the form data to the server.
    onSubmitForm(values);
  }

  return (
    <>
      <BarkForm onSubmit={onSubmit} form={form}>
        <BarkFormHeader>Add your details</BarkFormHeader>
        <BarkFormInput
          form={form}
          label="How would you like to be addressed?"
          name="name"
        />
        <BarkFormInput
          form={form}
          label="What number can we reach you on?"
          name="mobile"
        />

        <BarkFormRadioGroup
          form={form}
          label="Are you currently based in Singapore?"
          name="country-based"
          layout="button"
          options={[
            { label: "Yes", value: "yes" },
            {
              label: "No",
              value: "no",
            },
          ]}
        />

        <BarkFormInput
          form={form}
          label="Please provide your login email address"
          name="email"
          type="email"
        />

        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <BarkFormInput
              form={form}
              label="Enter OTP"
              name="otp"
              type="number"
              placeholder="Enter 0000 for testing purposes"
              description={
                form.watch("otp-verified")?.valueOf() === true
                  ? "OTP verified!"
                  : ""
              }
            >
              {otpSent ? (
                <>
                  <BarkFormButton
                    onClick={async () => {
                      console.log("resend otp");
                    }}
                  >
                    Resend OTP
                  </BarkFormButton>
                  <BarkFormButton
                    onClick={async () => {
                      console.log("verify otp");
                      form.setValue("otp-verified", true);
                    }}
                  >
                    Verify OTP
                  </BarkFormButton>
                </>
              ) : (
                <BarkFormButton
                  onClick={async () => {
                    console.log("send otp");
                    setOtpSent(true);
                  }}
                >
                  Send OTP
                </BarkFormButton>
              )}
            </BarkFormInput>
          </div>
        </div>

        <BarkFormSingleCheckbox
          form={form}
          label="Disclaimer"
          name="terms-and-conditions"
          optionLabel="By submitting this form, you agree to share your information with your preferred vets to schedule appointments for blood 
        profiling and donation."
        />

        <BarkFormSubmitButton
          disabled={!form.formState.isValid}
          className="w-full"
        >
          Submit
        </BarkFormSubmitButton>
      </BarkForm>
    </>
  );
}
