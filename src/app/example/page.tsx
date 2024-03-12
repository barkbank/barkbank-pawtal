import APP from "@/lib/app";
import DonorForm from "./donor-form";

export default async function Example() {
  const breedService = await APP.getBreedService();
  const breeds = await breedService.getAllBreeds();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <DonorForm breeds={breeds} />
    </main>
  );
}
