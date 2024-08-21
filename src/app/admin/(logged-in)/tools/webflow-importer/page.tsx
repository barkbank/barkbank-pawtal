"use client";

import { BarkBackLink } from "@/components/bark/bark-back-link";
import { RoutePath } from "@/lib/route-path";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarkForm } from "@/components/bark/bark-form";
import { BarkFormTextArea } from "@/components/bark/bark-form-text-area";
import { BarkButton } from "@/components/bark/bark-button";
import {
  RegistrationRequest,
  RegistrationRequestSchema,
} from "@/lib/bark/models/registration-models";
import {
  parseCommonDate,
  SINGAPORE_TIME_ZONE,
} from "@/lib/utilities/bark-time";
import { postWebFlowRegistrations } from "./_lib/post-webflow-registrations";
import { useState } from "react";
import { toString } from "lodash";

const FormDataSchema = z.object({
  registrationData: z.string(),
});

type FormData = z.infer<typeof FormDataSchema>;

const RegistrationDataSchema = z.object({
  registrations: z.array(
    RegistrationRequestSchema.omit({
      emailOtp: true,
      dogBirthday: true,
    }).extend({
      dogBirthday: z.string(),
    }),
  ),
});

export default function Page() {
  const [result, setResult] = useState("No Results");
  const form = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      registrationData: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const obj = JSON.parse(values.registrationData);
      const validated = RegistrationDataSchema.parse(obj);
      const results = await Promise.all(
        validated.registrations.map(async (registration) => {
          const { userEmail } = registration;
          const { dogBirthday, ...others } = registration;
          const req: RegistrationRequest = {
            emailOtp: "",
            dogBirthday: parseCommonDate(dogBirthday, SINGAPORE_TIME_ZONE),
            ...others,
          };
          const res = await postWebFlowRegistrations(req);
          return `${res} | ${userEmail}`;
        }),
      );
      setResult(JSON.stringify({ results }, null, 2));
    } catch (err) {
      setResult(toString(err));
    }
  };

  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_PAGE} />
      <div className="prose">
        <h1>WebFlow Importer</h1>
        <p>
          Paste the JSON encoded data and click "Import" to import users that
          registered on WebFlow.
        </p>
        <BarkForm form={form} onSubmit={onSubmit}>
          <BarkFormTextArea
            form={form}
            label="Registration Data"
            name="registrationData"
            rows={8}
          />
          <BarkButton variant="brand" type="submit">
            Import
          </BarkButton>
        </BarkForm>
        <pre>{result}</pre>
      </div>
    </div>
  );
}
