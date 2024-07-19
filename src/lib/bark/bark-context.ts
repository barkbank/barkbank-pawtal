import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import { EmailService } from "../services/email";

export type BarkContext = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
  oiiEncryptionService: EncryptionService;
  textEncryptionService: EncryptionService;
  emailService: EmailService;
};
