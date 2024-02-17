import breedService from "@/services/breedService";
import BreedForm from "./breedForm";

export default async function Example() {
  const breeds = await breedService.getAllBreeds();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BreedForm breeds={breeds} />
    </main>
  );
}
