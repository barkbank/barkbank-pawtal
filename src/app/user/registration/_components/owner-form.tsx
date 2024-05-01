"use client";

import {
  BarkForm,
  BarkFormButton,
  BarkFormError,
  BarkFormHeader,
  BarkFormInput,
  BarkFormParagraph,
  BarkFormRadioGroup,
  BarkFormSingleCheckbox,
  BarkFormSubmitButton,
} from "@/components/bark/bark-form";
import { postOtpRequest } from "@/lib/server-actions/post-otp-request";
import { isValidEmail } from "@/lib/utilities/bark-utils";
import { USER_RESIDENCY } from "@/lib/data/db-enums";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FORM_SCHEMA = z.object({
  userName: z.string().min(1, { message: "Name cannot be empty" }),
  userPhoneNumber: z.string(),
  userEmail: z.string().email(),
  userResidency: z.string().min(1, { message: "Residency must be specified" }),
  termsAndConditions: z.boolean().refine((value) => value === true, {
    message: "You must accept the disclaimer to proceed",
  }),
  emailOtp: z.string().min(1, { message: "OTP cannot be empty" }),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function OwnerForm(props: {
  defaultValues: FormDataType;
  registrationError: string | React.ReactNode;
  onSave: (values: FormDataType) => void;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}) {
  const {
    defaultValues,
    registrationError,
    onSave,
    onNext,
    onPrev,
    nextLabel,
    prevLabel,
  } = props;
  const [recipientEmail, setRecipientEmail] = React.useState<string>("");
  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues,
  });

  async function onRequestOtp() {
    const { userEmail } = form.getValues();
    form.clearErrors("emailOtp");
    if (isValidEmail(userEmail)) {
      // TODO: if the result of postOtpRequest is FAILED, we should ask user to request for another.
      await postOtpRequest({ emailAddress: userEmail, accountType: null });
      setRecipientEmail(userEmail);
      form.clearErrors("userEmail");
    } else {
      setRecipientEmail("");
      form.setError("userEmail", { message: "Invalid email address" });
    }
  }

  async function onSubmit(values: FormDataType) {
    onSave(values);
    onNext();
  }

  async function onPrevClick() {
    onSave(form.getValues());
    onPrev();
  }

  return (
    <>
      <BarkForm onSubmit={onSubmit} form={form}>
        <BarkFormHeader>Add your details</BarkFormHeader>
        <BarkFormRadioGroup
          form={form}
          label="Are you currently based in Singapore?"
          name="userResidency"
          layout="button"
          options={[
            { label: "Yes", value: USER_RESIDENCY.SINGAPORE },
            { label: "No", value: USER_RESIDENCY.OTHER },
          ]}
        />
        <BarkFormInput
          form={form}
          label="How would you like to be addressed?"
          name="userName"
        />
        <BarkFormInput
          form={form}
          label="What number can we reach you on?"
          name="userPhoneNumber"
        />
        <BarkFormInput
          form={form}
          label="Please provide a login email address"
          name="userEmail"
          type="email"
        />
        <BarkFormButton onClick={onRequestOtp}>Send me an OTP</BarkFormButton>
        {recipientEmail !== "" && (
          <BarkFormParagraph>
            An OTP has been sent to {recipientEmail}
          </BarkFormParagraph>
        )}
        <BarkFormInput
          form={form}
          label="Enter OTP"
          name="emailOtp"
          type="text"
        />
        <BarkFormSingleCheckbox
          form={form}
          label="Disclaimer"
          name="termsAndConditions"
          optionLabel="By submitting this form, you agree to share your information with your preferred vets to schedule appointments for blood 
        profiling and donation."
        />

        {registrationError && (
          // TODO: Make component for errors of this kind.
          <div className="mt-6 rounded-md border-2 border-brand bg-red-100 p-3 text-rose-600 shadow-md">
            {registrationError}
          </div>
        )}

        <div className="flex gap-2">
          <BarkFormButton onClick={onPrevClick} className="w-full">
            {prevLabel}
          </BarkFormButton>

          <BarkFormSubmitButton className="w-full">
            {nextLabel}
          </BarkFormSubmitButton>
        </div>
      </BarkForm>
    </>
  );
}
