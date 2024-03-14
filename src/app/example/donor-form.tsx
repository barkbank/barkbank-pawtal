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
  countryBased: z.string(),
  dogName: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.date(),
  dogGender: z.string(),
  dogWeightKg: z.number().optional(),
  dogDea1Point1: z.string(),
  dogEverReceivedTransfusion: z.string(),
  dogEverPregnant: z.string(),
  dogPreferredVetIdList: z.string(),
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
            form.setValue("dogName", values["dogName"]);
            form.setValue("dogBreed", values["dogBreed"]);
            form.setValue("dogBirthday", values["dogBirthday"]);
            form.setValue("dogGender", values["dogGender"]);
            form.setValue(
              "dogWeightKg",
              values["dogWeightKg"] === undefined
                ? Number(values["dogWeightKg"])
                : undefined,
            );
            form.setValue("dogDea1Point1", values["dogDea1Point1"]);
            form.setValue(
              "dogEverReceivedTransfusion",
              values["dogEverReceivedTransfusion"],
            );
            form.setValue("dogEverPregnant", values["dogEverPregnant"]);
            form.setValue(
              "dogPreferredVetIdList",
              values["dogPreferredVetIdList"],
            );

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
            form.setValue("countryBased", values["countryBased"]);
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
