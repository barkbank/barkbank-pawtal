import { SimpleErrorPage } from "@/app/_components/simple-error-page";
import { BarkBackLink } from "@/components/bark/bark-back-link";
import { Button } from "@/components/ui/button";
import APP from "@/lib/app";
import { VetClinic } from "@/lib/bark/models/vet-models";
import { opGetVetClinics } from "@/lib/bark/operations/op-get-vet-clinics";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";

export default async function Page() {
  const context = await APP.getBarkContext();
  const { result, error } = await opGetVetClinics(context);
  if (error !== undefined) {
    return <SimpleErrorPage error={error} />;
  }
  const { clinics } = result;
  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_PAGE} />
      <div className="prose">
        <h1>Vets</h1>
        <p>A tool for managing vet clinics and login accounts.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {clinics.map((clinic) => (
          <_ClinicCard clinic={clinic} key={clinic.vetId} />
        ))}
      </div>
      <div>
        <Link href={RoutePath.ADMIN_TOOLS_VETS_ADD_CLINIC}>
          <Button className="w-full p-6 md:w-40">Add</Button>
        </Link>
      </div>
    </div>
  );
}

function _ClinicCard(props: { clinic: VetClinic }) {
  const { clinic } = props;
  const { vetId, vetName, vetEmail, vetAddress, vetPhoneNumber } = clinic;
  return (
    <Link
      className="x-card x-card-bg flex flex-col gap-1 text-sm"
      href={RoutePath.ADMIN_TOOLS_VETS_VIEW_CLINIC(vetId)}
    >
      <p className="font-semibold">{vetName}</p>
      <p>Email: {vetEmail}</p>
      <p>Tel: {vetPhoneNumber}</p>
      <div>
        <p>Address:</p>
        <p>{vetAddress}</p>
      </div>
    </Link>
  );
}
