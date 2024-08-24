import { z } from "zod";

export enum AccountType {
  USER = "USER",
  VET = "VET",
  ADMIN = "ADMIN",
}

export const AccountTypeSchema = z.enum(["USER", "VET", "ADMIN"]);
