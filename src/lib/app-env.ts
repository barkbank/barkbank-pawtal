import { z } from "zod";

/**
 * An enumeration of all environment variables used by Pawtal.
 */
export const APP_ENV = {
  BARKBANK_ENV: "BARKBANK_ENV",

  BARKBANK_DB_HOST: "BARKBANK_DB_HOST",
  BARKBANK_DB_PORT: "BARKBANK_DB_PORT",
  BARKBANK_DB_NAME: "BARKBANK_DB_NAME",
  BARKBANK_DB_USER: "BARKBANK_DB_USER",
  BARKBANK_DB_PASSWORD: "BARKBANK_DB_PASSWORD",

  /**
   * File name for self-signed CA certificate.
   * https://node-postgres.com/features/ssl#self-signed-cert
   */
  BARKBANK_DB_CA_CERT_FILE: "BARKBANK_DB_CA_CERT_FILE",

  BARKBANK_OTP_NUM_RECENT_PERIODS: "BARKBANK_OTP_NUM_RECENT_PERIODS",
  BARKBANK_OTP_PERIOD_MILLIS: "BARKBANK_OTP_PERIOD_MILLIS",
  BARKBANK_OTP_SECRET: "BARKBANK_OTP_SECRET",
  BARKBANK_OTP_SENDER_EMAIL: "BARKBANK_OTP_SENDER_EMAIL",
  BARKBANK_OTP_SENDER_NAME: "BARKBANK_OTP_SENDER_NAME",

  /**
   * Secret key for hashing emails
   */
  BARKBANK_EMAIL_SECRET: "BARKBANK_EMAIL_SECRET",

  BARKBANK_IKM1_HEX: "BARKBANK_IKM1_HEX",
  BARKBANK_IKM2_HEX: "BARKBANK_IKM2_HEX",

  BARKBANK_SMTP_HOST: "BARKBANK_SMTP_HOST",
  BARKBANK_SMTP_PORT: "BARKBANK_SMTP_PORT",
  BARKBANK_SMTP_USER: "BARKBANK_SMTP_USER",
  BARKBANK_SMTP_PASSWORD: "BARKBANK_SMTP_PASSWORD",

  /**
   * The root admin email is a whitelisted admin email address for which account
   * will be granted the permission to manage admin accounts.
   */
  BARKBANK_ROOT_ADMIN_EMAIL: "BARKBANK_ROOT_ADMIN_EMAIL",

  /**
   * Configuration for /api/dangerous.
   *
   * To enable the API, DANGEROUS_ENABLED must be 'true' and
   * DANGEROUS_CREDENTIALS should be set to some 'username:password'. Then when
   * calling the API, the base64 of username:password should be presented via
   * Basic Authorization header.
   */
  DANGEROUS_ENABLED: "DANGEROUS_ENABLED",
  DANGEROUS_CREDENTIALS: "DANGEROUS_CREDENTIALS",
} as const;

export const AppEnvSchema = z.nativeEnum(APP_ENV);

export type AppEnv = z.infer<typeof AppEnvSchema>;
