"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarkForm,
  BarkFormButton,
  BarkFormInput,
  BarkFormParagraph,
  BarkFormSubmitButton,
} from "@/components/bark/bark-form";
import { useState } from "react";
import { sendLoginOtp } from "./_actions";
import { Button } from "@/components/ui/button";

const FORM_SCHEMA = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function LoginForm() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const emailForm = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  async function onSubmit(values: FormDataType) {
    console.log("TODO - Authenticate", values);
  }

  async function onRequestOtp() {
    const {email} = emailForm.getValues();
    emailForm.clearErrors("otp");
    try {
      const validEmail = z.string().email().parse(email);
      emailForm.clearErrors("email");
      console.log("Send OTP to %s", validEmail);
      await sendLoginOtp(validEmail);
      // Do not show errors to user here so that this doesn't become an
      // interface for querying our database.
      setRecipientEmail(validEmail);
    } catch {
      emailForm.setError("email", {message: "Invalid email address"});
      setRecipientEmail("");
    }
  }

  return (
    <>
      <BarkForm form={emailForm} onSubmit={onSubmit}>
        <BarkFormInput
          form={emailForm}
          name="email"
          label="Please provide your email address"
        />
        {/* TODO - We need a CAPTCHA to prevent abuse of Send me an OTP */}
        <BarkFormButton onClick={onRequestOtp}>Send me an OTP</BarkFormButton>
        {recipientEmail !== "" && <BarkFormParagraph>An OTP has been sent to {recipientEmail}</BarkFormParagraph>}
        <BarkFormInput
          form={emailForm}
          name="otp"
          label="Enter OTP"
        />
        <BarkFormSubmitButton>Login</BarkFormSubmitButton>
      </BarkForm>
    </>
  );
}
