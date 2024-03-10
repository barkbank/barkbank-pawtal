"use client";

import { Stepper } from "@/components/ui/stepper";
import { Breed } from "@/lib/services/breed";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PetForm from "./petForm";
import OwnerForm from "./ownerForm";
import { BarkH4, BarkP } from "@/components/bark/bark-typography";
import Image from "next/image";

const steps = ["Tell us about your pet", "Add your details", "Enter Pawtal!"];

const FORM_SCHEMA = z.object({
  name: z.string(),
  mobile: z.string(),
  email: z.string().email(),
  "country-based": z.string(),
  "dog-name": z.string(),
  "dog-breed": z.string(),
  "dog-birthday": z.date(),
  "dog-sex": z.string(),
  "dog-weight": z.string().regex(/^\d+(\.\d+)?$/),
  "dog-blood-type": z.string(),
  "dog-blood-transfusion-status": z.string(),
  "dog-pregnant-status": z.string(),
  "dog-last-heartworm-vaccination": z.date().optional().or(z.literal("")),
  "dog-last-donation": z.date().optional().or(z.literal("")),
  "dog-preferred-vets": z.array(z.string()),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

export default function DonorForm({ breeds }: { breeds: Breed[] }) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [complete, setComplete] = React.useState(false);
  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
  });

  async function onSubmit() {
    // ! Send the form data to the server.
    console.log(form.getValues());
    setComplete(true);
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <Image
          src={"/orangeDogHouse.svg"}
          alt="" // Decorative image so alt text is empty
          height={100}
          width={100}
        />
        <BarkH4>Bark Bank Canine Blood Donation Pawtal</BarkH4>
      </div>
      <div className="mt-20">
      <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {complete ? (
        <BarkP>
          Thank you for your information, your account has been created.
          You&apos;ll be directed to your account shortly. If not, please log in
          at www.pawtal.barkbank.co.
        </BarkP>
      ) : currentStep === 0 ? (
        <PetForm
          onSubmitForm={(values) => {
            form.setValue("dog-name", values["dog-name"]);
            form.setValue("dog-breed", values["dog-breed"]);
            form.setValue("dog-birthday", values["dog-birthday"]);
            form.setValue("dog-sex", values["dog-sex"]);
            form.setValue("dog-weight", values["dog-weight"]);
            form.setValue("dog-blood-type", values["dog-blood-type"]);
            form.setValue(
              "dog-blood-transfusion-status",
              values["dog-blood-transfusion-status"],
            );
            form.setValue("dog-pregnant-status", values["dog-pregnant-status"]);
            form.setValue(
              "dog-last-heartworm-vaccination",
              values["dog-last-heartworm-vaccination"],
            );
            form.setValue("dog-last-donation", values["dog-last-donation"]);
            form.setValue("dog-preferred-vets", values["dog-preferred-vets"]);

            setCurrentStep(currentStep + 1);
          }}
          breeds={breeds}
        />
      ) : (
        <OwnerForm
          onSubmitForm={(values) => {
            form.setValue("name", values.name);
            form.setValue("mobile", values.mobile);
            form.setValue("email", values.email);
            form.setValue("country-based", values["country-based"]);
            onSubmit();
          }}
        />
      )}
    </div>
  );
}
