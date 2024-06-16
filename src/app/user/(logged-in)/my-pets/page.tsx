import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { getMyPets } from "@/lib/user/actions/get-my-pets";
import { BarkButton } from "@/components/bark/bark-button";
import { DogCard } from "./_lib/components/dog-card";

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
  return (
    <div className="m-3">
      {dogs.map((dog, idx, ary) => (
        <DogCard
          key={dog.dogId}
          dog={dog}
          cardIdx={idx}
          isLastCard={idx === ary.length - 1}
        />
      ))}
      <BarkButton
        className="mt-3 w-full"
        variant="brandInverse"
        href={RoutePath.USER_ADD_DOG}
      >
        Add Pet
      </BarkButton>
    </div>
  );
}
