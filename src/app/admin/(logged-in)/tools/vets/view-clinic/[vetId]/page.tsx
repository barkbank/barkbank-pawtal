import { BarkBackLink } from "@/components/bark/bark-back-link";
import { Button } from "@/components/ui/button";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";

export default async function Page(props: { params: { vetId: string } }) {
  const { vetId } = props.params;
  const actor = (await getAuthenticatedAdminActor())!;
  const { clinic } = (await actor.getVetClinicByVetId({ vetId })).result!;
  const { accounts } = (await actor.getVetAccountsByVetId({ vetId })).result!;

  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_VETS_LIST_CLINICS} />
      <div className="prose">
        <h1>View Clinic</h1>
        <pre>{JSON.stringify({ clinic, accounts }, null, 2)}</pre>
      </div>
      <Button variant="secondary" className="w-full p-6 md:w-40">
        Edit Clinic
      </Button>
      <Button variant="secondary" className="w-full p-6 md:w-40">
        Add Account
      </Button>
    </div>
  );
}
