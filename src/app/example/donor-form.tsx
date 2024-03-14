"use client";

import { Stepper } from "@/components/ui/stepper";
import { Breed } from "@/lib/services/breed";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PetForm from "./pet-form";
import OwnerForm from "./owner-form";
import { BarkH4, BarkP } from "@/components/bark/bark-typography";
import Image from "next/image";
import Link from "next/link";

const FORM_SCHEMA = z.object({
  name: z.string(),
  mobile: z.string(),
  email: z.string().email(),
  "country-based": z.string(),
  "dog-name": z.string(),
  "dog-breed": z.string(),
  "dog-birthday": z.date(),
  "dog-sex": z.string(),
  "dog-weight": z.number(),
  "dog-blood-type": z.string(),
  "dog-blood-transfusion-status": z.string(),
  "dog-pregnant-status": z.string(),
  "dog-preferred-vet": z.string(),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

const steps = ["Tell us about your pet", "Add your details", "Enter Pawtal!"];
const STEPS = { PET: 0, OWNER: 1, SUCCESS: 2 };

export default function DonorForm({ breeds }: { breeds: Breed[] }) {
  const [currentStep, setCurrentStep] = React.useState(STEPS.PET);

  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
  });

  async function onSubmit() {
    // ! Send the form data to the server.
    console.log(form.getValues());
    setCurrentStep(STEPS.SUCCESS);
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <Image src={"/orange-dog-house.svg"} alt="" height={100} width={100} />
        <BarkH4>Bark Bank Canine Blood Donation Pawtal</BarkH4>
      </div>
      <div className="mt-20">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {currentStep === STEPS.PET ? (
        <PetForm
          onSubmitForm={(values) => {
            form.setValue("dog-name", values["dog-name"]);
            form.setValue("dog-breed", values["dog-breed"]);
            form.setValue("dog-birthday", values["dog-birthday"]);
            form.setValue("dog-sex", values["dog-sex"]);
            form.setValue("dog-weight", Number(values["dog-weight"]));
            form.setValue("dog-blood-type", values["dog-blood-type"]);
            form.setValue(
              "dog-blood-transfusion-status",
              values["dog-blood-transfusion-status"],
            );
            form.setValue("dog-pregnant-status", values["dog-pregnant-status"]);
            form.setValue("dog-preferred-vet", values["dog-preferred-vet"]);

            setCurrentStep(currentStep + 1);
          }}
          breeds={breeds}
        />
      ) : currentStep === STEPS.OWNER ? (
        <OwnerForm
          onSubmitForm={(values) => {
            form.setValue("name", values.name);
            form.setValue("mobile", values.mobile);
            form.setValue("email", values.email);
            form.setValue("country-based", values["country-based"]);
            onSubmit();
          }}
        />
      ) : (
        <div className="text-center">
          <BarkH4>
            Thank you for your information, your account has been created.
            You&apos;ll be directed to your account shortly. If not, please log
            in at{" "}
            <span className="hover:underline">
              <Link href="/bark/login">www.pawtal.barkbank.co</Link>
            </span>
          </BarkH4>

          <div className="mt-8 grid grid-cols-1 gap-20 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <Image src={"/check-mail.svg"} alt="" height={100} width={100} />
              <BarkH4>Confirmation Email</BarkH4>
              <BarkP>
                An email confirmation will be sent to you shortly with the
                details of your submission.
              </BarkP>
            </div>

            <div className="flex flex-col items-center text-center">
              <Image src={"/contact-us.svg"} alt="" height={100} width={100} />
              <BarkH4>Upcoming Blood Profiling</BarkH4>
              <BarkP>
                Your preferred vet will contact you within the week to schedule
                a blood profiling session for your dog.
              </BarkP>
            </div>

            <div className="flex flex-col items-center text-center">
              <Image src={"/email.svg"} alt="" height={100} width={100} />
              <BarkH4>Contact Us</BarkH4>
              <BarkP>
                Feel free to reach out with any inquiries regarding your
                registration by sending an email us at hello@barkbank.co.
                We&apos;re here to assist!
              </BarkP>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
