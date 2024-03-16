"use client";

import { Stepper } from "@/components/ui/stepper";
import { Breed } from "@/lib/services/breed";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PetForm from "./pet-form";
import OwnerForm from "./owner-form";
import { BarkH1, BarkH4, BarkP } from "@/components/bark/bark-typography";
import Image from "next/image";
import Link from "next/link";
import { RoutePath } from "@/lib/route-path";
import { useRouter } from "next/navigation";

const FORM_SCHEMA = z.object({
  dogName: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.date().nullable(),
  dogGender: z.string(),
  dogWeightKg: z.string(),
  dogDea1Point1: z.string(),
  dogEverReceivedTransfusion: z.string(),
  dogEverPregnant: z.string(),
  dogPreferredVetId: z.string(),

  userResidency: z.string(),
  userName: z.string(),
  userPhoneNumber: z.string(),
  userEmail: z.string().email(),
  emailOtp: z.string(),
  termsAndConditions: z.boolean(),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

const steps = ["Tell us about your pet", "Add your details", "Enter Pawtal!"];
const STEPS = { PET: 0, OWNER: 1, SUCCESS: 2 };

export default function DonorForm({ breeds }: { breeds: Breed[] }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(STEPS.PET);

  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      dogName: "",
      dogBreed: "",
      dogBirthday: null,
      dogGender: "",
      dogWeightKg: "",
      dogDea1Point1: "",
      dogEverReceivedTransfusion: "",
      dogEverPregnant: "",
      dogPreferredVetId: "",
      userResidency: "",
      userName: "",
      userPhoneNumber: "",
      userEmail: "",
      emailOtp: "",
      termsAndConditions: false,
    },
  });

  async function doRegistration() {
    // WIP: Call registerNewUser here.
    console.log(form.getValues());
    setCurrentStep(STEPS.SUCCESS);
  }

  return (
    <div className="w-screen px-6 md:w-[800px]">
      <div className="flex flex-col items-center gap-2">
        <Image src={"/orange-dog-house.svg"} alt="" height={100} width={100} />
        <div className="mt-4 text-center">
          <BarkH4>Bark Bank Canine Blood Donation Pawtal</BarkH4>
        </div>
        {/* <BarkH4>Bark Bank Canine Blood Donation Pawtal</BarkH4> */}
      </div>
      <div className="stretch mt-20">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {currentStep === STEPS.PET && (
        <PetForm
          breeds={breeds}
          defaultValues={form.getValues()}
          onSave={(values) => {
            form.setValue("dogName", values.dogName);
            form.setValue("dogBreed", values.dogBreed);
            form.setValue("dogBirthday", values.dogBirthday);
            form.setValue("dogGender", values.dogGender);
            form.setValue("dogWeightKg", values.dogWeightKg);
            form.setValue("dogDea1Point1", values.dogDea1Point1);
            form.setValue(
              "dogEverReceivedTransfusion",
              values.dogEverReceivedTransfusion,
            );
            form.setValue("dogEverPregnant", values.dogEverPregnant);
            form.setValue("dogPreferredVetId", values.dogPreferredVetId);
          }}
          onPrev={() => {
            // TODO: The PREV action is destructive, there should be a confirmation dialog.
            router.push(RoutePath.ROOT);
          }}
          onNext={() => {
            setCurrentStep(STEPS.OWNER);
          }}
          prevLabel="Cancel"
          nextLabel="Next"
        />
      )}

      {currentStep === STEPS.OWNER && (
        <OwnerForm
          defaultValues={form.getValues()}
          onSave={(values) => {
            form.setValue("userResidency", values.userResidency);
            form.setValue("userName", values.userName);
            form.setValue("userPhoneNumber", values.userPhoneNumber);
            form.setValue("userEmail", values.userEmail);
            form.setValue("emailOtp", values.emailOtp);
            form.setValue("termsAndConditions", values.termsAndConditions);
          }}
          onPrev={() => setCurrentStep(STEPS.PET)}
          onNext={doRegistration}
          prevLabel="Back"
          nextLabel="Submit"
        />
      )}

      {currentStep === STEPS.SUCCESS && (
        <div className="text-center">
          <BarkH4>
            Thank you for your information, your account has been created.
            You'll be directed to your account shortly.
          </BarkH4>
          <BarkP>
            If not, please{" "}
            <Link className="hover:underline" href="/bark/login">
              CLICK HERE
            </Link>{" "}
            to login.
          </BarkP>

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
                registration by sending an email us at hello@barkbank.co. We're
                here to assist!
              </BarkP>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
