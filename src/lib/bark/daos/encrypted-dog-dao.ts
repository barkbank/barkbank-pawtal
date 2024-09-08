import { DbContext } from "@/lib/data/db-utils";
import { EncryptedDog, EncryptedDogSpec } from "../models/dog-profile-models";
import { z } from "zod";

export class EncryptedDogDao {
  constructor(private db: DbContext) {}

  async insert(args: { spec: EncryptedDogSpec }): Promise<{ dogId: string }> {
    const RowSchema = z.object({ dogId: z.string() });
    throw new Error("Not implemented");
  }

  async get(args: { dogId: string }): Promise<EncryptedDog> {
    throw new Error("Not implemented");
  }

  async listByUser(args: { userId: string }): Promise<EncryptedDog[]> {
    throw new Error("Not implemented");
  }

  async listByVet(args: { vetId: string }): Promise<EncryptedDog[]> {
    throw new Error("Not implemented");
  }

  async clearPreferredVet(args: { dogId: string }): Promise<void> {
    throw new Error("Not implemented");
  }

  async setPreferredVet(args: { dogId: string; vetId: string }): Promise<void> {
    throw new Error("Not implemented");
  }

  async getPreferredVet(args: { dogId: string }): Promise<{ vetId: string }> {
    const RowSchema = z.object({ vetId: z.string() });
    throw new Error("Not implemented");
  }
}
