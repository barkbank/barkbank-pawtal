"use client";

import { Stepper } from "@/components/ui/stepper";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PetForm from "./pet-form";
import OwnerForm from "./owner-form";
import { BarkH4, BarkP } from "@/components/bark/bark-typography";
import Image from "next/image";
import Link from "next/link";
import { RoutePath } from "@/lib/route-path";
import { useRouter, useSearchParams } from "next/navigation";
import { BarkFormOption } from "@/components/bark/bark-form-option";
import { postRegistrationRequest } from "@/app/user/registration/_actions/post-registration-request";
import { DogAntigenPresence } from "@/lib/bark/enums/dog-antigen-presence";
import { YesNoUnknown } from "@/lib/bark/enums/yes-no-unknown";
import { DogGender } from "@/lib/bark/enums/dog-gender";
import { UserResidency } from "@/lib/bark/enums/user-residency";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { IMG_PATH } from "@/lib/image-path";
import { AccountType } from "@/lib/auth-models";
import { CODE } from "@/lib/utilities/bark-code";
import { RequiredDateField } from "@/app/_lib/field-schemas/required-date-field";
import { CONTACT_EMAIL } from "@/lib/bark/constants/contact-email";
import clsx from "clsx";
import {
  RegistrationRequest,
  RegistrationRequestSchema,
} from "@/lib/bark/models/registration-models";
import { UserTitleSchema } from "@/lib/bark/enums/user-title";
import { postPawtalEvent } from "@/app/_lib/actions/post-pawtal-event";
import { PAWTAL_EVENT_TYPE } from "@/lib/bark/enums/pawtal-event-type";
import { PawtalEventClientSpec } from "@/lib/bark/models/event-models";
import { v4 as uuidv4 } from "uuid";
import { toQueryParams } from "@/app/_lib/to-query-params";

const FORM_SCHEMA = z.object({
  dogName: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.string(),
  dogGender: z.string(),
  dogWeightKg: z.string(),
  dogDea1Point1: z.string(),
  dogEverReceivedTransfusion: z.string(),
  dogEverPregnant: z.string(),
  dogPreferredVetId: z.string().optional(),
  userResidency: z.string(),
  userTitle: UserTitleSchema.optional(),
  userName: z.string(),
  userPhoneNumber: z.string(),
  userEmail: z.string().email(),
  emailOtp: z.string(),
  termsAndConditions: z.boolean(),
});

type FormDataType = z.infer<typeof FORM_SCHEMA>;

const steps = ["Tell us about your pet", "Add your details", "Enter Pawtal!"];
const STEPS = { PET: 0, OWNER: 1, SUCCESS: 2 };

type FunnelState = {
  started?: boolean;
  completedDogProfile?: boolean;
  requestedOtp?: boolean;
  submittedRegistration?: boolean;
  accountCreated?: boolean;
};

export default function DonorForm(props: {
  breeds: string[];
  vetOptions: BarkFormOption[];
}) {
  const { breeds, vetOptions } = props;
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.PET);
  const [registrationError, setRegistrationError] = useState<
    string | React.ReactNode
  >("");
  const [rtk] = useState<string>(uuidv4());
  const [funnelState, setFunnelState] = useState<FunnelState>(() => {
    return { started: true };
  });
  const [funnelEvents, setFunnelEvents] = useState<FunnelState>({});
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentStep]);

  const form = useForm<FormDataType>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      dogName: "",
      dogBreed: "",
      dogBirthday: "",
      dogGender: "",
      dogWeightKg: "",
      dogDea1Point1: "",
      dogEverReceivedTransfusion: "",
      dogEverPregnant: "",
      dogPreferredVetId: undefined,
      userResidency: "",
      userName: "",
      userPhoneNumber: "",
      userEmail: "",
      emailOtp: "",
      termsAndConditions: false,
    },
  });

  useEffect(() => {
    const queryParams = toQueryParams(searchParams);
    async function _postEvent(step: string) {
      const spec: PawtalEventClientSpec = {
        eventType: PAWTAL_EVENT_TYPE.REGISTRATION,
        eventData: {
          rtk,
          step,
          queryParams,
        },
      };
      await postPawtalEvent({ spec });
    }

    if (funnelState.started && !funnelEvents.started) {
      _postEvent("000-start");
      setFunnelEvents({ ...funnelEvents, started: true });
    }
    if (funnelState.completedDogProfile && !funnelEvents.completedDogProfile) {
      _postEvent("100-dog");
      setFunnelEvents({ ...funnelEvents, completedDogProfile: true });
    }
    if (funnelState.requestedOtp && !funnelEvents.requestedOtp) {
      _postEvent("200-otp");
      setFunnelEvents({ ...funnelEvents, requestedOtp: true });
    }
    if (
      funnelState.submittedRegistration &&
      !funnelEvents.submittedRegistration
    ) {
      _postEvent("300-owner");
      setFunnelEvents({ ...funnelEvents, submittedRegistration: true });
    }
    if (funnelState.accountCreated && !funnelEvents.accountCreated) {
      _postEvent("400-account");
      setFunnelEvents({ ...funnelEvents, accountCreated: true });
    }
  }, [funnelState, funnelEvents, searchParams, rtk]);

  function getRegistrationRequest(): RegistrationRequest {
    const vals = form.getValues();

    const out: RegistrationRequest = {
      emailOtp: vals.emailOtp,
      userTitle: vals.userTitle,
      userName: vals.userName,
      userEmail: vals.userEmail,
      userPhoneNumber: vals.userPhoneNumber,
      userResidency: vals.userResidency as UserResidency,
      dogName: vals.dogName,
      dogBreed: vals.dogBreed,
      dogBirthday: RequiredDateField.new().parse(vals.dogBirthday),
      dogGender: vals.dogGender as DogGender,
      dogWeightKg: vals.dogWeightKg === "" ? null : Number(vals.dogWeightKg),
      dogDea1Point1: vals.dogDea1Point1 as DogAntigenPresence,
      dogEverPregnant: vals.dogEverPregnant as YesNoUnknown,
      dogEverReceivedTransfusion:
        vals.dogEverReceivedTransfusion as YesNoUnknown,
      // If there is only one vet, use that vet as the preferred vet,
      // otherwise, use the value from the form.
      // Vet id can be undefined.
      dogPreferredVetId:
        vals.dogPreferredVetId ??
        (vetOptions.length === 1 ? vetOptions[0].value : undefined),
    };
    return RegistrationRequestSchema.parse(out);
  }

  const { dogPreferredVetId } = form.watch();
  const hasPreferredVet =
    dogPreferredVetId !== undefined && dogPreferredVetId !== "";

  async function doRegistration(): Promise<void> {
    setRegistrationError("");
    const req = getRegistrationRequest();
    const res = await postRegistrationRequest(req);
    setFunnelState({ ...funnelState, submittedRegistration: true });
    if (res === CODE.ERROR_INVALID_OTP) {
      setRegistrationError(
        "The OTP submitted is invalid. Please request for another and try again.",
      );
      setCurrentStep(STEPS.OWNER);
      return;
    }
    if (res === CODE.ERROR_ACCOUNT_ALREADY_EXISTS) {
      setRegistrationError(
        <p>
          Account already exists. Please{" "}
          <Link href={RoutePath.USER_LOGIN_PAGE}>
            <span className="font-bold">CLICK HERE</span>
          </Link>{" "}
          to login.
        </p>,
      );
      setCurrentStep(STEPS.OWNER);
      return;
    }
    if (res !== CODE.OK) {
      setRegistrationError(
        "Oops! Something went wrong at the Pawtal! Please request for another OTP and try again.",
      );
      setCurrentStep(STEPS.OWNER);
      return;
    }

    const result = await signIn("credentials", {
      email: req.userEmail,
      otp: req.emailOtp,
      accountType: AccountType.USER,
      redirect: false,
    });

    if (result === undefined || !result.ok) {
      setRegistrationError(
        <p>
          Account was created, but login failed. Please{" "}
          <Link href={RoutePath.USER_LOGIN_PAGE}>CLICK HERE</Link> to login.
        </p>,
      );
      setCurrentStep(STEPS.OWNER);
      return;
    }
    setCurrentStep(STEPS.SUCCESS);
    setFunnelState({ ...funnelState, accountCreated: true });
  }

  return (
    <div className="w-screen px-6 pb-24 pt-12 md:w-[800px]">
      <div className="flex flex-col items-center gap-2">
        <Image
          src={IMG_PATH.ORANGE_DOG_HOUSE}
          alt=""
          height={100}
          width={100}
        />
        <div className="mt-6 text-center">
          <BarkH4>Bark Bank Canine Blood Donation Pawtal</BarkH4>
        </div>
      </div>
      <div className="stretch mt-6">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {currentStep === STEPS.PET && (
        <PetForm
          breeds={breeds}
          vetOptions={vetOptions}
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
            setRegistrationError("");
            setCurrentStep(STEPS.OWNER);
            setFunnelState({ ...funnelState, completedDogProfile: true });
          }}
          prevLabel="Cancel"
          nextLabel="Next"
        />
      )}

      {currentStep === STEPS.OWNER && (
        <OwnerForm
          defaultValues={form.getValues()}
          registrationError={registrationError}
          onSave={(values) => {
            form.setValue("userResidency", values.userResidency);
            form.setValue("userName", values.userName);
            form.setValue("userTitle", values.userTitle);
            form.setValue("userPhoneNumber", values.userPhoneNumber);
            form.setValue("userEmail", values.userEmail);
            form.setValue("emailOtp", values.emailOtp);
            form.setValue("termsAndConditions", values.termsAndConditions);
          }}
          onPrev={() => {
            setCurrentStep(STEPS.PET);
            setRegistrationError("");
            form.setValue("emailOtp", "");
          }}
          onNext={doRegistration}
          onRequestedOtp={() => {
            setFunnelState({ ...funnelState, requestedOtp: true });
          }}
          prevLabel="Back"
          nextLabel="Submit"
        />
      )}

      {currentStep === STEPS.SUCCESS && (
        <div className="mt-6 text-center">
          <BarkH4>
            Thank you for your information, your account has been created.
          </BarkH4>
          <div className="mt-6">
            <Button
              variant="brand"
              className="w-full p-6"
              onClick={() => {
                router.push(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE);
                router.refresh();
              }}
            >
              Enter My Dashboard
            </Button>
          </div>

          <div
            className={clsx("mt-6 grid grid-cols-1 gap-20", {
              "md:grid-cols-2": !hasPreferredVet,
              "md:grid-cols-3": hasPreferredVet,
            })}
          >
            <div className="flex flex-col items-center text-center">
              <Image
                src={IMG_PATH.CHECK_MAIL}
                alt=""
                height={100}
                width={100}
              />
              <BarkH4>Confirmation Email</BarkH4>
              <BarkP>
                An email confirmation will be sent to you shortly with the
                details of your submission.
              </BarkP>
            </div>

            {hasPreferredVet && (
              <div className="flex flex-col items-center text-center">
                <Image
                  src={IMG_PATH.CONTACT_US}
                  alt=""
                  height={101}
                  width={100}
                />
                <BarkH4>Upcoming Blood Profiling</BarkH4>
                <BarkP>
                  Your preferred vet will contact you within the week to
                  schedule a blood profiling session for your dog.
                </BarkP>
              </div>
            )}

            <div className="flex flex-col items-center text-center">
              <Image src={IMG_PATH.EMAIL} alt="" height={100} width={100} />
              <BarkH4>Contact Us</BarkH4>
              <BarkP>
                Feel free to reach out with any inquiries regarding your
                registration by sending an email to us at {CONTACT_EMAIL}.
                We&apos;re here to assist!
              </BarkP>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
