"use client";

import { BarkForm } from "@/components/bark/bark-form";
import {
  BarkFormErrorParagraph,
  BarkFormHeader,
  BarkFormParagraph,
} from "@/components/bark/bark-form-typography";
import { BarkFormInput } from "@/components/bark/bark-form-input";
import { BarkFormSingleCheckbox } from "@/components/bark/bark-form-single-checkbox";
import { BarkFormRadioGroup } from "@/components/bark/bark-form-radio-group";
import { postOtpRequest } from "@/lib/server-actions/post-otp-request";
import { isValidEmail } from "@/lib/utilities/bark-utils";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkButton } from "@/components/bark/bark-button";
import { BarkFormSelect } from "@/components/bark/bark-form-select";
import { USER_TITLE_OPTIONS } from "@/app/_lib/constants";
import { UserTitleSchema } from "@/lib/bark/enums/user-title";

const FORM_SCHEMA = z.object({
  userName: z.string().min(1, { message: "Name cannot be empty" }),
  userTitle: UserTitleSchema.optional(),
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
  const [otpState, setOtpState] = useState<{
    status: "PENDING" | "SEND_SUCCESS" | "SEND_FAILED";
    email: string;
  }>({
    status: "PENDING",
    email: "",
  });
  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues,
  });

  async function onRequestOtp() {
    const { userEmail } = form.getValues();
    form.clearErrors("emailOtp");
    if (isValidEmail(userEmail)) {
      form.clearErrors("userEmail");
      const res = await postOtpRequest({
        emailAddress: userEmail,
        accountType: null,
      });
      if (res !== CODE.OK) {
        setOtpState({ status: "SEND_FAILED", email: userEmail });
      } else {
        setOtpState({ status: "SEND_SUCCESS", email: userEmail });
      }
    } else {
      setOtpState({ status: "PENDING", email: "" });
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
        <BarkFormSelect
          form={form}
          label="Please also specify a preferred title"
          name="userTitle"
          options={USER_TITLE_OPTIONS}
          placeholder="-- Select --"
        />
        <BarkFormInput
          form={form}
          label="At which phone number can you be reached?"
          name="userPhoneNumber"
        />
        <BarkFormInput
          form={form}
          label="Please provide a login email address"
          name="userEmail"
          type="email"
        />
        <BarkButton
          variant="brandInverse"
          className="mt-3"
          onClick={onRequestOtp}
          type="button"
        >
          Send me an OTP
        </BarkButton>
        {otpState.status === "SEND_SUCCESS" && (
          <BarkFormParagraph>
            An OTP has been sent to {otpState.email}. Please check your junk
            mail folder and ensure that &lsquo;Bark Bank&rsquo; is added to your
            list of approved senders.
          </BarkFormParagraph>
        )}
        {otpState.status === "SEND_FAILED" && (
          <BarkFormErrorParagraph>
            Failed to send OTP. Please request another.
          </BarkFormErrorParagraph>
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

        <div className="mt-3 flex gap-3">
          <BarkButton
            variant="brandInverse"
            onClick={onPrevClick}
            className="w-full"
            type="button"
          >
            {prevLabel}
          </BarkButton>

          <BarkButton variant="brand" type="submit" className="w-full">
            {nextLabel}
          </BarkButton>
        </div>
      </BarkForm>
    </>
  );
}
