import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";

export type BarkContext = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
  oiiEncrypteionService: EncryptionService;
  textEncryptionService: EncryptionService;
};
