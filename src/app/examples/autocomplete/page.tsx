import dog_breeds_json from "@/resources/dog_breeds.json";
import { z } from "zod";

const DogBreedJsonSchema = z.object({
  dog_breeds: z.array(
    z.object({
      dog_breed: z.string(),
      wikipedia_url: z.string(),
    }),
  ),
});

function getBreeds(): string[] {
  const data = DogBreedJsonSchema.parse(dog_breeds_json);
  return data.dog_breeds.map((item) => item.dog_breed);
}

export default async function Page() {
  const breeds = getBreeds();
  return (
    <div className="x-card">
      <div className="prose">
        <h1>Autocomplete Example</h1>
      </div>
      <pre>{JSON.stringify(breeds)}</pre>
    </div>
  );
}
