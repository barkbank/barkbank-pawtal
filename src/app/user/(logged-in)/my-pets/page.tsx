import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { getMyPets } from "@/lib/user/actions/get-my-pets";
import { BarkButton } from "@/components/bark/bark-button";
import { DogCard } from "./_lib/components/dog-card";
import { IneligibilityReason } from "@/lib/bark/enums/ineligibility-reason";

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
  // WIP: Call opGetIneligibilityFactors for each dog in 'dogs'
  // WIP: Convert factors to reasons using toIneligibilityReasons
  const ineligibilityReasons: IneligibilityReason[] = [];
  return (
    <div className="m-3 flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {dogs.map((dog, idx, ary) => (
          <DogCard
            key={dog.dogId}
            dog={dog}
            ineligibilityReasons={ineligibilityReasons}
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
