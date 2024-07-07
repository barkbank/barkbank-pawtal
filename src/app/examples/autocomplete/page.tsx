import { BreedForm } from "./_lib/breed-form";
import { getDogBreeds } from "@/app/_lib/get-dog-breeds";

export default async function Page() {
  const breeds = getDogBreeds();
  return (
    <div className="x-card m-3">
      <BreedForm breeds={breeds} />
    </div>
  );
}
