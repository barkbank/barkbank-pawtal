import { promises as fs } from "fs";

export type Breed = {
  dog_breed: string;
  wikipedia_url: string;
};

class BreedService {
  /**
   * Get all breeds.
   * @returns
   */
  async getAllBreeds() {
    try {
      const file = await fs.readFile(
        process.cwd() + "/src/resources/dog_breeds.json",
        "utf8",
      );
      const data = JSON.parse(file) as {
        dog_breeds: { dog_breed: string; wikipedia_url: string }[];
      };

      return data.dog_breeds;
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }
}

const breedService = new BreedService();
export default breedService;
