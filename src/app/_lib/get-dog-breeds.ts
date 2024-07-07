import breeds_json from "@/resources/data/breeds.json";

export function getDogBreeds(): string[] {
  return breeds_json.breeds;
}
