import APP from "@/lib/app";
import DonorForm from "./_components/donor-form";
import { AccountType } from "@/lib/auth-models";
import { isLoggedIn } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { getVetFormOptions } from "@/app/_lib/get-vet-form-options";
import breeds_json from "@/resources/data/breeds.json";

export default async function Page() {
  if (await isLoggedIn(AccountType.USER)) {
    redirect(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE);
  }

  const vetOptions = await APP.getDbPool().then(getVetFormOptions);
  const breeds = breeds_json.breeds;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <DonorForm breeds={breeds} vetOptions={vetOptions} />
    </main>
  );
}
