/**
 * An enumeration of all environment variables used by Pawtal.
 */
export enum AppEnv {
  NODE_ENV = "NODE_ENV",

  BARKBANK_DB_HOST = "BARKBANK_DB_HOST",
  BARKBANK_DB_PORT = "BARKBANK_DB_PORT",
  BARKBANK_DB_NAME = "BARKBANK_DB_NAME",
  BARKBANK_DB_USER = "BARKBANK_DB_USER",
  BARKBANK_DB_PASSWORD = "BARKBANK_DB_PASSWORD",

  BARKBANK_OTP_NUM_RECENT_PERIODS = "BARKBANK_OTP_NUM_RECENT_PERIODS",
  BARKBANK_OTP_PERIOD_MILLIS = "BARKBANK_OTP_PERIOD_MILLIS",
  BARKBANK_OTP_SECRET = "BARKBANK_OTP_SECRET",
  BARKBANK_OTP_SENDER_EMAIL = "BARKBANK_OTP_SENDER_EMAIL",
  BARKBANK_OTP_SENDER_NAME = "BARKBANK_OTP_SENDER_NAME",

  /**
   * Secret key for PII secrets.
   */
  BARKBANK_PII_SECRET = "BARKBANK_PII_SECRET",

  /**
   * Secret key for Owner Identifiable Information (OII) secrets.
   */
  BARKBANK_OII_SECRET = "BARKBANK_OII_SECRET",

  /**
   * Secret key for text in general.
   */
  BARKBANK_TEXT_SECRET = "BARKBANK_TEXT_SECRET",

  BARKBANK_SMTP_HOST = "BARKBANK_SMTP_HOST",
  BARKBANK_SMTP_PORT = "BARKBANK_SMTP_PORT",
  BARKBANK_SMTP_USER = "BARKBANK_SMTP_USER",
  BARKBANK_SMTP_PASSWORD = "BARKBANK_SMTP_PASSWORD",

  /**
   * The root admin email is a whitelisted admin email address for which account
   * will be granted the permission to manage admin accounts.
   */
  BARKBANK_ROOT_ADMIN_EMAIL = "BARKBANK_ROOT_ADMIN_EMAIL",

  /**
   * Configuration for /api/dangerous.
   *
   * To enable the API, DANGEROUS_ENABLED must be 'true' and
   * DANGEROUS_CREDENTIALS should be set to some 'username:password'. Then when
   * calling the API, the base64 of username:password should be presented via
   * Basic Authorization header.
   */
  DANGEROUS_ENABLED = "DANGEROUS_ENABLED",
  DANGEROUS_CREDENTIALS = "DANGEROUS_CREDENTIALS",
}
