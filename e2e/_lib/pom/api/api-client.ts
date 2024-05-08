import { APIRequestContext } from "@playwright/test";
import { PomContext } from "../core/pom-object";

export class ApiClient {
  constructor(
    public context: PomContext,
    public request: APIRequestContext,
  ) {}

  async getCookies(): Promise<string> {
    const headers: Record<string, string> = {};
    const cookies = await this.context.page.context().cookies();
    const encodedCookies = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join(";");
    return encodedCookies;
  }

  async get(path: string) {
    const url = this.context.website.urlOf(path);
    const cookies = await this.getCookies();
    return this.request.get(url, {
      headers: {
        Cookie: cookies,
      },
    });
  }

  async sql<T = any>(sql: string, args: any[]): Promise<T[]> {
    const url = this.context.website.urlOf("/api/dangerous/sql");
    const res = await this.request.post(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic ZGV2ZWxvcGVyOnBhc3N3b3Jk",
      },
      data: { sql, args },
    });
    const data = await res.json();
    return data.rows;
  }
}
