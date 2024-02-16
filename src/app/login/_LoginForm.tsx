"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarkForm,
  BarkFormInput,
  BarkFormSubmitButton,
} from "@/components/bark/bark-form";
import { useState } from "react";
import { sendOtp } from "./_actions";

const EMAIL_FORM_SCHEMA = z.object({
  email: z.string().email(),
});

type EmailFormDataType = z.infer<typeof EMAIL_FORM_SCHEMA>;

const OTP_FORM_SCHEMA = z.object({
  otp: z.string().min(6).max(6),
});

type OtpFormDataType = z.infer<typeof OTP_FORM_SCHEMA>;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const emailForm = useForm<EmailFormDataType>({
    resolver: zodResolver(EMAIL_FORM_SCHEMA),
    defaultValues: {
      email: "",
    },
  });
  const otpForm = useForm<OtpFormDataType>({
    resolver: zodResolver(OTP_FORM_SCHEMA),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmitEmail(values: EmailFormDataType) {
    console.log("SubmitEmail:", values);
    const { email } = values;
    await sendOtp(email);
    setEmail(email);
  }

  async function onSubmitOtp(values: OtpFormDataType) {
    const credentials = { email, ...values };
    console.log("SubmitOtp:", credentials);
  }

  return (
    <>
      {email === "" && (
        <BarkForm form={emailForm} onSubmit={onSubmitEmail}>
          <BarkFormInput
            form={emailForm}
            name="email"
            label="Enter email address"
          />
          <BarkFormSubmitButton label="Send me an OTP" />
        </BarkForm>
      )}
      {email !== "" && (
        <BarkForm form={otpForm} onSubmit={onSubmitOtp}>
          <BarkFormInput
            form={otpForm}
            name="otp"
            label="Enter 6-digit OTP"
            description={`OTP was sent to ${email}`}
          />
          <BarkFormSubmitButton label="Submit" />
        </BarkForm>
      )}
    </>
  );
}
