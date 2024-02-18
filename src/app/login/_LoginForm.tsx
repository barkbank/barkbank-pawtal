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
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RoutePath } from "@/lib/routes";

const FORM_SCHEMA = z.object({
  email: z.string().email(),
  otp: z.string().min(1, { message: "OTP cannot be empty" }),
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

  function validateEmail(email: string): string {
    try {
      const validEmail = z.string().email().parse(email);
      form.clearErrors("email");
      return validEmail;
    } catch {
      form.setError("email", { message: "Invalid email address" });
      return "";
    }
  }

  async function onRequestOtp() {
    const { email } = form.getValues();
    form.clearErrors("otp");
    const validEmail = validateEmail(email);
    if (validEmail) {
      await sendLoginOtp(validEmail);
      // Do not show errors to user here so that this doesn't become an
      // interface for querying our database.
      setRecipientEmail(validEmail);
    } else {
      setRecipientEmail("");
    }
  }

  async function onSubmit(values: FormDataType) {
    const { email, otp } = values;
    await signIn("credentials", { email, otp });
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
        <BarkFormSubmitButton>Login</BarkFormSubmitButton>{" "}
        <Link href={RoutePath.ROOT}>
          <Button variant="secondary" type="button">
            Cancel
          </Button>
        </Link>
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
