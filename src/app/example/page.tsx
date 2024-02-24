import BreedForm from "./breedForm";
import APP from "@/lib/app";

export default async function Example() {
  const breedService = await APP.getBreedService();
  const breeds = await breedService.getAllBreeds();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BreedForm breeds={breeds} />
    </main>
  );
}
