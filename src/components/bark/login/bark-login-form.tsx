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
import { SignInResponse, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { sendLoginOtp } from "@/lib/server-actions/send-login-otp";
import { AccountType } from "@/lib/auth-models";

const FORM_SCHEMA = z.object({
  email: z.string().email(),
  otp: z.string().min(1, { message: "OTP cannot be empty" }),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function BarkLoginForm(props: {
  accountType: AccountType;
  successPath: string;
}) {
  const { accountType, successPath } = props;
  const router = useRouter();
  const hasErrorInQueryString = useSearchParams().get("error") !== null;
  const [shouldShowLoginFailed, setShouldShowLoginFailed] = useState(
    hasErrorInQueryString,
  );
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailOtpError, setEmailOtpError] = useState("");
  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

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
    setShouldShowLoginFailed(false);
    const { email } = form.getValues();
    form.clearErrors("otp");
    const validEmail = validateEmail(email);
    if (validEmail) {
      const res = await sendLoginOtp({ emailAddress: validEmail, accountType });
      if (res === "OK") {
        setRecipientEmail(validEmail);
        setEmailOtpError("");
      } else if (res === "NO_ACCOUNT") {
        setRecipientEmail("");
        setEmailOtpError("No account");
      } else {
        setRecipientEmail("");
        setEmailOtpError("Failed to send OTP email");
      }
    } else {
      setRecipientEmail("");
    }
  }

  async function onSubmit(values: FormDataType) {
    const { email, otp } = values;

    // https://next-auth.js.org/getting-started/client#using-the-redirect-false-option
    const result = await signIn("credentials", {
      email,
      otp,
      accountType,
      redirect: false,
    });
    if (!result) {
      setShouldShowLoginFailed(true);
      return;
    }
    const { ok } = result as SignInResponse;
    if (!ok) {
      setShouldShowLoginFailed(true);
      return;
    }
    router.push(successPath);
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
        {emailOtpError !== "" && (
          <h4 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight text-red-600">
            {emailOtpError}
          </h4>
        )}
        <BarkFormInput form={form} name="otp" label="Enter OTP" />
        <div className="flex w-full gap-x-4">
          <BarkFormButton onClick={async () => router.push(RoutePath.ROOT)}>
            Cancel
          </BarkFormButton>
          <BarkFormSubmitButton>Login</BarkFormSubmitButton>
        </div>
        <BarkFormError form={form} />
        {shouldShowLoginFailed && (
          <h4 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight text-red-600">
            Login Failed
          </h4>
        )}
      </BarkForm>
    </>
  );
}
