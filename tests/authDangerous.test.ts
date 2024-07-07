import { BARKBANK_ENV } from "@/lib/barkbank-env";
import { authDangerous } from "@/middleware";
import { NextRequest } from "next/server";

describe("authDangerous", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should return 404 if not in TEST environment", async () => {
    const envs: NodeJS.Dict<string> = {
      BARKBANK_ENV: BARKBANK_ENV.PRODUCTION,
    };
    const request = {} as NextRequest;
    const response = await authDangerous(request, envs);
    expect(response?.status).toBe(404);
  });

  it("should return 401 if dangerous credentials are not provided", async () => {
    const envs: NodeJS.Dict<string> = {
      BARKBANK_ENV: BARKBANK_ENV.TEST,
    };
    const request = {} as NextRequest;
    const response = await authDangerous(request, envs);
    expect(response?.status).toBe(401);
  });

  it("should return 401 if authorization header is incorrect", async () => {
    const envs: NodeJS.Dict<string> = {
      BARKBANK_ENV: BARKBANK_ENV.TEST,
      DANGEROUS_CREDENTIALS: "user:pass",
    };
    const request: any = {
      headers: {
        get: jest.fn().mockReturnValue("Basic incorrect-credentials"),
      },
    };
    const response = await authDangerous(request, envs);
    expect(response?.status).toBe(401);
  });

  it("should return 403 if dangerous feature is not enabled", async () => {
    const envs: NodeJS.Dict<string> = {
      BARKBANK_ENV: BARKBANK_ENV.TEST,
      DANGEROUS_CREDENTIALS: "user:pass",
      DANGEROUS_ENABLED: "",
    };
    const request: any = {
      headers: {
        get: jest
          .fn()
          .mockReturnValue(
            `Basic ${Buffer.from("user:pass").toString("base64")}`,
          ),
      },
    };
    const response = await authDangerous(request, envs);
    expect(response?.status).toBe(403);
  });

  it("should return next response if all conditions are met", async () => {
    const envs: NodeJS.Dict<string> = {
      BARKBANK_ENV: BARKBANK_ENV.TEST,
      DANGEROUS_CREDENTIALS: "user:pass",
      DANGEROUS_ENABLED: "true",
    };
    const request: any = {
      headers: {
        get: jest
          .fn()
          .mockReturnValue(
            `Basic ${Buffer.from("user:pass").toString("base64")}`,
          ),
      },
    };
    const response = await authDangerous(request, envs);
    expect(response).toBeNull();
  });
});
