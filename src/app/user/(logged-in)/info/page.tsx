import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { BarkH2, BarkH5, BarkP } from "@/components/bark/bark-typography";
import { IMG_PATH } from "@/lib/image-path";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/bark/constants/contact-email";

const criterias = [
  { text: "At least 20KG in weight", imgUrl: IMG_PATH.WEIGHING_MACHINE },
  {
    text: "Between 1 to 8 years old",
    imgUrl: IMG_PATH.BIRTHDAY_CAKE,
  },
  { text: "Calm temperament preferred", imgUrl: IMG_PATH.LOTUS },
  {
    text: "Healthy with no underlying health conditions",
    imgUrl: IMG_PATH.HEALTH_CARE,
  },
  {
    text: "Have not donated blood in the last 3 months",
    imgUrl: IMG_PATH.BLOOD_TEST,
  },
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
    text: "Never received a blood transfusion",
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

const ContactEmail = () => (
  <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
);
const PrivacyPolicy = () => (
  <Link href="https://www.barkbank.co/privacy-policy">
    https://www.barkbank.co/privacy-policy
  </Link>
);

const faqs = [
  {
    question: `What does it mean if my dog is labeled as "Permanently Ineligible" for blood donation?`,
    answer: (
      <p>
        Your dog is considered permanently ineligible if they have ever been
        pregnant, received a blood transfusion, are over 8 years old, or have a
        medical report indicating permanent ineligibility.
      </p>
    ),
  },
  {
    question: `What does "Unknown" eligibility status signify?`,
    answer: (
      <p>
        The &ldquo;Unknown&rdquo; status means that it is not confirmed whether
        your dog is permanently ineligible due to unknown pregnancy or blood
        transfusion history, or unspecified breed and weight.
      </p>
    ),
  },
  {
    question: `Under what conditions is my dog "Temporarily Ineligible" for donating blood?`,
    answer: (
      <p>
        Your dog is temporarily ineligible if they are underweight (less than 20
        KG), underage (less than 1 year), recently donated blood (within the
        last 3 months), recently vaccinated (within the last 2 weeks), recently
        tested positive for heartworm (within the last 6 months), or have been
        deemed temporarily ineligible by a vet.
      </p>
    ),
  },
  {
    question: `How is a dog determined to be "Eligible" for blood donation?`,
    answer: (
      <>
        <p>
          A dog is eligible when they meet all the criteria for blood donation,
          have completed all required medical information and currently in
          active participation. Criteria for canine blood donation:
        </p>
        <p>
          <b>Weight:</b> Dogs should weigh at least 20kg but not be overweight.
        </p>
        <p>
          <b>Age:</b> Dogs between 1 to 8 years old are generally eligible.
        </p>
        <p>
          <b>Temperament:</b> Donor dogs should have a good and calm temperament
          to minimise stress during the process.
        </p>
        <p>
          <b>Health:</b> They should be healthy with no underlying health
          conditions.
        </p>
        <p>
          <b>Vaccinations:</b> Donor dogs should be up to date on vaccinations.
        </p>
        <p>
          <b>Parasite Prevention:</b> They should be on regular parasite
          prevention medication for heart worm, tick, and flea control.
        </p>
        <p>
          <b>Blood Transfusion:</b> Dogs that have received a blood transfusion
          are not eligible to donate.
        </p>
        <p>
          <b>Donation Frequency:</b> A healthy dog can donate blood every 3
          months, which equals up to 4 times a year.
        </p>
        <p>
          <b>Gender:</b> Male dogs or nulliparous (never pregnant) female dogs
          are typically accepted.
        </p>
        <p>
          <b>Medications:</b> Donor dogs should not be on any medications that
          could pose a problem for the recipient.
        </p>
      </>
    ),
  },
  {
    question: `What is the Bark Bank blood donation process?`,
    answer: (
      <>
        <p>
          <b>Step 1 — Registration:</b> Begin by registering your dog on Bark
          Bank&apos;s Canine Blood Registry Pawtal, completing your contact
          information, providing basic medical details about your dog, and
          selecting your preferred vet donation point.
        </p>
        <p>
          <b>Step 2 — Appointment scheduling:</b> Once registered, your vet will
          schedule an appointment for health screening, blood profiling test,
          and blood donation.
        </p>
        <p>
          <b>Step 3 — Vet appointment:</b> Head to your scheduled vet
          appointment with your dog at the designated time for a health check
          and blood donation
        </p>
        <p>
          <b>Step 4 — Medical Report:</b> Your vet will update your dog&apos;s
          medical details directly on the Pawtal after the appointment.
        </p>
      </>
    ),
  },
  {
    question: `Can I contact the vet directly?`,
    answer: (
      <p>
        Yes, you may arrange an appointment with the vet directly. However, it
        is encouraged to register with Bark Bank so that dogs in need have a
        centralised system with updated donor dog details. This helps ensure
        that all necessary information is available and organised, facilitating
        better coordination and care.
      </p>
    ),
  },
  {
    question: `What happens if I need to reschedule or cancel my vet appointment?`,
    answer: (
      <p>
        Please contact the vet directly to reschedule or cancel your
        appointment. They will be able to assist you with finding a new time
        that works for both you and the veterinary office.
      </p>
    ),
  },
  {
    question: `What if my dog is unwell after an appointment has been scheduled?`,
    answer: (
      <p>
        If your dog is unwell after scheduling an appointment, it is important
        to either reschedule the appointment with the vet or change the
        participation status if the dog will be unavailable for more than 2
        weeks. This ensures that your dog receives the necessary care and rest,
        and the donation schedule is updated accordingly to reflect their
        current health status.
      </p>
    ),
  },
  {
    question: `Who should I reach out to for additional questions?`,
    answer: (
      <p>
        Please email <ContactEmail /> if you have more questions. We are here to
        assist you with any inquiries you may have.
      </p>
    ),
  },
  {
    question: `How can I delete my account?`,
    answer: (
      <p>
        You can write in to <ContactEmail /> to request for your account to be
        deleted. We will guide you through the process and address any concerns
        you may have.
      </p>
    ),
  },
  {
    question: `What is the Bark Bank privacy policy?`,
    answer: (
      <p>
        The Bark Bank privacy policy details how we handle your data and protect
        your privacy. You can review our policy at <PrivacyPolicy />.
      </p>
    ),
  },
  {
    question: `How can I request for my data?`,
    answer: (
      <p>
        To request all the information collected about you and understand how it
        has been used, please write to <ContactEmail />. We will provide you
        with the necessary details and assist with any further queries.
      </p>
    ),
  },
];

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  return (
    <main className="flex flex-col 2xl:items-center">
      <section className="mx-[60px] my-[60px]">
        <div className=" py-[45px]  text-center xl:w-auto">
          <span className="self-center">
            <BarkH2>Criteria For Blood Donation</BarkH2>
          </span>
          <BarkP>
            To be eligible for blood donation, dogs must meet specific criteria
            to ensure the safety of both donors and recipients. It is advisable
            to consult with your veterinarian for a comprehensive understanding
            of these criteria. The following are the typical criteria:
          </BarkP>
        </div>
        <div className="mb-[60px] grid grid-cols-1 place-items-center gap-[60px] px-4 sm:grid-cols-2 lg:grid-cols-3">
          {criterias.map((criteria, i) => (
            <div
              key={criteria.text}
              className={`flex flex-col items-center gap-y-4 ${criterias.length % 2 !== 0 && i === criterias.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
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
        </div>
      </section>
      <section className="flex flex-col items-center bg-beige px-[60px] py-[30px] xl:flex-row">
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
      <section className="mx-[60px] my-[80px] flex max-w-7xl flex-col items-center gap-[50px]">
        <div className="mb-[21px] text-center sm:col-span-2 md:col-span-3 lg:mt-[40px]">
          <BarkH2>Frequently Asked Questions</BarkH2>
        </div>
        <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 xl:grid-cols-3">
          {faqs.map(({ question, answer }, idx) => (
            <Accordion
              key={idx}
              orientation="vertical"
              type="single"
              collapsible
            >
              <AccordionItem className="border-none" value={`item-${idx}`}>
                <AccordionTrigger>
                  <p className="w-full text-left text-base font-semibold">
                    {question}
                  </p>
                </AccordionTrigger>
                <AccordionContent className="prose">{answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </section>
    </main>
  );
}
