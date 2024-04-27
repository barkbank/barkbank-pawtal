import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import {
  BarkH2,
  BarkH3,
  BarkH4,
  BarkH5,
  BarkP,
} from "@/components/bark/bark-typography";
import { IMG_PATH } from "@/lib/image-path";
import Image from "next/image";

const criteras = [
  { text: ">20KG in weight", imgUrl: IMG_PATH.WEIGHING_MACHINE },
  {
    text: "Between 1 to 8 years old",
    imgUrl: IMG_PATH.BIRTHDAY_CAKE,
  },
  { text: "Calm temperament preferred", imgUrl: IMG_PATH.LOTUS },
  {
    text: "Healthy with no underlying health conditions",
    imgUrl: IMG_PATH.HEALTH_CARE,
  },
  { text: "DEA 1.1 or 1.2 negative blood type", imgUrl: IMG_PATH.BLOOD_TEST },
  {
    text: "Up to date on vaccinations & parasite prevention",
    imgUrl: IMG_PATH.VACCINE,
  },
  { text: "Never pregnant (for female)", imgUrl: IMG_PATH.SMILING_DOG },
  {
    text: "Not  on any medication that could pose a problem to recipient",
    imgUrl: IMG_PATH.DRUGS,
  },
  {
    text: "Never received a blood transfusion, donated blood >3 months ago",
    imgUrl: IMG_PATH.BLOOD_TRANSFUSION,
  },
];

const registrationSteps = [
  {
    heading: "Registration",
    text: "Begin by registering your dog on Bark Bank’s Canine Blood Registry Pawtal, completing your contact information, providing basic medical details about your dog, and selecting your preferred vet donation point.",
  },
  {
    heading: "Appointment Scheduling",
    text: "Once registered, your vet will schedule an appointment for health screening, blood profiling test, and blood donation.",
  },
  {
    heading: "Vet Appointment",
    text: "Head to your scheduled vet appointment with your dog at the designated time for a health check and blood donation.",
  },
  {
    heading: "Medical Report",
    text: "Your vet will update your dog’s medical details directly on the Pawtal after the appointment.",
  },
];

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  return (
    <main className="flex flex-col 2xl:items-center">
      <section className="mx-[60px] mt-[60px] max-w-7xl py-[45px] text-center">
        <BarkH2>Criteria For Blood Donation</BarkH2>
        <BarkP>
          To be eligible for blood donation, dogs must meet specific criteria to
          ensure the safety of both donors and recipients. It is advisable to
          consult with your veterinarian for a comprehensive understanding of
          these criteria. The following are the typical criteria:
        </BarkP>
      </section>
      <section className="mb-[60px] grid grid-cols-1 place-items-center gap-[60px] px-4 sm:grid-cols-2 lg:grid-cols-3">
        {criteras.map((criteria, i) => (
          <div
            key={criteria.text}
            className={`flex flex-col items-center gap-y-4 ${criteras.length % 2 !== 0 && i === criteras.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
          >
            <Image
              src={criteria.imgUrl}
              alt="criteria icon"
              className="lg:h-[100px] lg:w-[100px]"
              width={50}
              height={50}
            />
            <p className="max-w-[60%] text-center">{criteria.text}</p>
          </div>
        ))}
      </section>
      <section className="bg-beige flex flex-col items-center px-[60px] py-[30px] xl:flex-row">
        <Image
          width={129}
          height={151}
          src={IMG_PATH.DOG_GETTING_TRANSFUSION}
          alt="dog getting blood transfusion"
          className="mb-[60px] lg:mb-0 lg:h-[300px] lg:w-[300px] xl:mr-[60px]"
        />
        <article className="flex flex-col lg:grid lg:grid-cols-2">
          <div className="mb-[21px] text-center md:col-span-2 lg:mt-[40px] xl:place-self-start">
            <BarkH2>Blood Donation Drive Process</BarkH2>
          </div>
          {registrationSteps.map((step, index) => (
            <div
              key={step.heading}
              className="mb-[40px] flex flex-col items-center last:mb-0 lg:flex-row lg:items-start "
            >
              <div className="mb-[20px] flex min-h-11 min-w-11 items-center justify-center rounded-full bg-brand lg:mr-[20px] lg:self-start">
                <span className="font-bold text-brand-white">{index + 1}</span>
              </div>
              <div>
                <span className="text-center lg:text-left">
                  <BarkH5>{step.heading}</BarkH5>
                </span>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
