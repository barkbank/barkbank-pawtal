import { BarkBackLink } from "@/components/bark/bark-back-link";
import { Button } from "@/components/ui/button";
import APP from "@/lib/app";
import { toVetAccount } from "@/lib/bark/mappers/to-vet-account";
import { SecureVetAccountDao } from "@/lib/bark/queries/secure-vet-account-dao";
import { VetClinicDao } from "@/lib/bark/queries/vet-clinic-dao";
import { RoutePath } from "@/lib/route-path";

export default async function Page(props: { params: { vetId: string } }) {
  const { vetId } = props.params;
  const context = await APP.getBarkContext();
  const { dbPool } = context;
  const clinicDao = new VetClinicDao(dbPool);
  const accountDao = new SecureVetAccountDao(dbPool);
  const clinic = await clinicDao.getByVetId({ vetId });
  const secureAccounts = await accountDao.listByVetId({ vetId });
  const accounts = await Promise.all(
    secureAccounts.map((secureAccount) => toVetAccount(context, secureAccount)),
  );
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
