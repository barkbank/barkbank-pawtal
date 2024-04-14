import { getAuthenticatedVetActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { getAvailableDogs } from "@/lib/vet/actions/get-available-dogs";
import { getOwnerContactDetails } from "@/lib/vet/actions/get-owner-contact-details";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor = await getAuthenticatedVetActor();
  if (!actor) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const availableDogs = await getAvailableDogs(actor);
  const data = await Promise.all(
    availableDogs.map(async (availableDog) => {
      const { dogId } = availableDog;
      const ownerContactDetails = await getOwnerContactDetails(actor, dogId);
      return { availableDog, ownerContactDetails };
    }),
  );
  return (
    <div>
      Data: <pre className="text-[6pt] md:text-base">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
