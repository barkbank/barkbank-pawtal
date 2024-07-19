import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { getMyPets } from "@/lib/user/actions/get-my-pets";
import { BarkButton } from "@/components/bark/bark-button";
import { DogCard, DogCardData } from "./_lib/components/dog-card";
import APP from "@/lib/app";
import { opGetIneligibilityFactors } from "@/lib/bark/operations/op-get-ineligibility-factors";
import { toIneligibilityReasons } from "@/lib/bark/mappers/to-ineligibility-reasons";

export default async function Page() {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const { result: dogs, error } = await getMyPets(actor);
  if (error !== undefined) {
    return (
      <div className="m-3">
        <p className="text-base">
          Failed to load pet data. Please refresh the page to try again.
        </p>
      </div>
    );
  }
  const context = await APP.getBarkContext();
  const dataList: DogCardData[] = await Promise.all(
    dogs.map(async (dog) => {
      const { dogId } = dog;
      const res = await opGetIneligibilityFactors(context, { dogId });
      if (res.error !== undefined) {
        throw new Error(res.error);
      }
      const ineligibilityReasons = toIneligibilityReasons(res.result.factors);
      return {
        dog,
        ineligibilityReasons,
      };
    }),
  );
  return (
    <div className="m-3 flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {dataList.map((data, idx, ary) => (
          <DogCard
            key={data.dog.dogId}
            data={data}
            cardIdx={idx}
            isLastCard={idx === ary.length - 1}
          />
        ))}
      </div>
      <BarkButton
        className="w-full md:w-48"
        variant="brandInverse"
        href={RoutePath.USER_ADD_DOG}
      >
        Add Pet
      </BarkButton>
    </div>
  );
}
