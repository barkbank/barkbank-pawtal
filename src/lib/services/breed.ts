import dog_breeds_json from "@/resources/dog_breeds.json";

export type Breed = {
  dog_breed: string;
  wikipedia_url: string;
};

export class BreedService {
  /**
   * Get all breeds.
   * @returns
   */
  public async getAllBreeds(): Promise<Breed[]> {
    try {
      const data = dog_breeds_json as {
        dog_breeds: { dog_breed: string; wikipedia_url: string }[];
      };

      return data.dog_breeds;
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }
}
