"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarkForm,
  BarkFormButton,
  BarkFormError,
  BarkFormInput,
  BarkFormParagraph,
  BarkFormSubmitButton,
} from "@/components/bark/bark-form";
import { useState } from "react";
import { sendLoginOtp } from "./_actions";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { BarkH4 } from "@/components/bark/bark-typography";

const FORM_SCHEMA = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function LoginForm() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const qs = useSearchParams();

  async function onRequestOtp() {
    const { email } = form.getValues();
    form.clearErrors("otp");
    try {
      const validEmail = z.string().email().parse(email);
      form.clearErrors("email");
      console.log("Send OTP to %s", validEmail);
      await sendLoginOtp(validEmail);
      // Do not show errors to user here so that this doesn't become an
      // interface for querying our database.
      setRecipientEmail(validEmail);
    } catch {
      form.setError("email", { message: "Invalid email address" });
      setRecipientEmail("");
    }
  }

  async function onSubmit(values: FormDataType) {
    const { email, otp } = values;
    signIn("credentials", { email, otp });
  }

  return (
    <>
      <BarkForm form={form} onSubmit={onSubmit}>
        <BarkFormInput
          form={form}
          name="email"
          label="Please provide your email address"
        />
        {/* TODO - We need a CAPTCHA to prevent abuse of Send me an OTP */}
        <BarkFormButton onClick={onRequestOtp}>Send me an OTP</BarkFormButton>
        {recipientEmail !== "" && (
          <BarkFormParagraph>
            An OTP has been sent to {recipientEmail}
          </BarkFormParagraph>
        )}
        <BarkFormInput form={form} name="otp" label="Enter OTP" />
        <BarkFormSubmitButton>Login</BarkFormSubmitButton>
        <BarkFormError form={form} />
        {qs.get("error") !== null && (
          <h4 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight text-red-600">
            Login Failed
          </h4>
        )}
      </BarkForm>
    </>
  );
}
