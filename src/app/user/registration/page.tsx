"use server";

import APP from "@/lib/app";
import DonorForm from "./_components/donor-form";
import { AccountType } from "@/lib/auth-models";
import { isLoggedIn } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { getVetOptions } from "./_lib/get-vet-options";
import { Breed } from "@/lib/services/breed";
import { BarkFormOption } from "@/components/bark/bark-form";

export default async function Page() {
  if (await isLoggedIn(AccountType.USER)) {
    redirect(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE);
  }

  async function getBreeds(): Promise<Breed[]> {
    const service = await APP.getBreedService();
    return service.getAllBreeds();
  }

  async function getVetFormOptions(): Promise<BarkFormOption[]> {
    const dbPool = await APP.getDbPool();
    const options = await getVetOptions(dbPool);
    return options.map((opt) => {
      return {
        value: opt.vetId,
        label: opt.vetName,
        description: opt.vetAddress,
      } as BarkFormOption;
    });
  }

  const [breeds, vetOptions] = await Promise.all([
    getBreeds(),
    getVetFormOptions(),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <DonorForm breeds={breeds} vetOptions={vetOptions} />
    </main>
  );
}
