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
    it("should return true when DANGEROUS_ENABLED is 'true' and NODE_ENV is 'development'", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "true",
        NODE_ENV: "development",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(true);
    });
    it("should return true when DANGEROUS_ENABLED is 'true' and NODE_ENV is 'test'", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "true",
        NODE_ENV: "test",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(true);
    });
    it("should return false when DANGEROUS_ENABLED is 'true' and NODE_ENV is 'production'", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "true",
        NODE_ENV: "production",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(false);
    });
    it("should return false when DANGEROUS_ENABLED is 'false' and NODE_ENV is 'development'", () => {
      const envs: NodeJS.Dict<string> = {
        DANGEROUS_ENABLED: "false",
        NODE_ENV: "development",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(false);
    });
    it("should return false when DANGEROUS_ENABLED is undefined and NODE_ENV is 'development'", () => {
      const envs: NodeJS.Dict<string> = {
        NODE_ENV: "development",
      };
      const app = new AppFactory(envs);
      expect(app.getDangerousApiIsEnabled()).toBe(false);
    });
  });
});
