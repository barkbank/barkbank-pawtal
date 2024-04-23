import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { BarkH2, BarkP } from "@/components/bark/bark-typography";
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

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  return (
    <main className="flex flex-col 2xl:items-center">
      <section className="mx-[60px] mt-[60px] max-w-7xl py-[45px] text-center">
        <BarkH2>Criteria For Blood Donation</BarkH2>
        <BarkP classes="text-sm">
          To be eligible for blood donation, dogs must meet specific criteria to
          ensure the safety of both donors and recipients. It is advisable to
          consult with your veterinarian for a comprehensive understanding of
          these criteria. The following are the typical criteria:
        </BarkP>
      </section>
      <section className="mb-[60px] grid max-w-7xl grid-cols-2 gap-x-[60px] px-4 text-sm md:mx-0 md:grid-cols-3 md:gap-x-[100px] md:gap-y-[60px] md:px-[60px]">
        {criteras.map((criteria) => (
          <div
            key={criteria.text}
            className="flex min-w-40 flex-col items-center space-y-4 md:max-w-60 "
          >
            <Image
              src={criteria.imgUrl}
              alt="criteria icon"
              className="h-[50px] w-[50px] md:h-[100px] md:w-[100px]"
              width={50}
              height={50}
            />
            <p className="text-center">{criteria.text}</p>
          </div>
        ))}
      </section>     
    </main>
  );
}
