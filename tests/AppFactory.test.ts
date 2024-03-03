import { AppFactory } from "@/lib/app";

describe("AppFactory", () => {
  describe("getNodeEnv", () => {
    it("should return 'production' when process.env.NODE_ENV is 'production'", () => {
      const envs: NodeJS.Dict<string> = {
        NODE_ENV: "production",
      };
      const app = new AppFactory(envs);
      expect(app.getNodeEnv()).toEqual("production");
    });
    it("should return 'development' when process.env.NODE_ENV is 'development'", () => {
      const envs: NodeJS.Dict<string> = {
        NODE_ENV: "development",
      };
      const app = new AppFactory(envs);
      expect(app.getNodeEnv()).toEqual("development");
    });
    it("should return 'test' when process.env.NODE_ENV is 'test'", () => {
      const envs: NodeJS.Dict<string> = {
        NODE_ENV: "test",
      };
      const app = new AppFactory(envs);
      expect(app.getNodeEnv()).toEqual("test");
    });
    it("should return 'development' when process.env.NODE_ENV is undefined", () => {
      const envs: NodeJS.Dict<string> = {};
      const app = new AppFactory(envs);
      expect(app.getNodeEnv()).toEqual("development");
    });
  });
  describe("getDangerousApiIsEnabled", () => {
    it("should return true when DANGEROUS_ENABLED is 'true', DANGEROUS_CREDENTIALS are provided, and NODE_ENV is 'development'", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "true",
        DANGEROUS_CREDENTIALS: "user:pass",
        NODE_ENV: "development",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(true);
    });
    it("should return true when DANGEROUS_ENABLED is 'true', DANGEROUS_CREDENTIALS are provided, and NODE_ENV is 'test'", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "true",
        DANGEROUS_CREDENTIALS: "user:pass",
        NODE_ENV: "test",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(true);
    });
    it("should return false when DANGEROUS_ENABLED is 'true', DANGEROUS_CREDENTIALS are provided, and NODE_ENV is 'production'", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "true",
        DANGEROUS_CREDENTIALS: "user:pass",
        NODE_ENV: "production",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(false);
    });
    it("should return false when DANGEROUS_ENABLED is 'false'", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "false",
        DANGEROUS_CREDENTIALS: "user:pass",
        NODE_ENV: "development",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(false);
    });
    it("should return false when DANGEROUS_ENABLED is unspecified", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_CREDENTIALS: "user:pass",
        NODE_ENV: "development",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(false);
    });
    it("should return false when DANGEROUS_CREDENTIALS is empty string", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "true",
        DANGEROUS_CREDENTIALS: "",
        NODE_ENV: "development",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(false);
    });
    it("should return false when DANGEROUS_CREDENTIALS is unspecified", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "true",
        NODE_ENV: "development",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(false);
    });
  });
});
