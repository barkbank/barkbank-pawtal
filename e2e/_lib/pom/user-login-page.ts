import { Locator, expect } from "@playwright/test";
import { RoutePath } from "@/lib/route-path";
import { UserMyPetsPage } from "./user-my-pets-page";
import { PomContext } from "./pom-context";

export class UserLoginPage {
  constructor(private ctx: PomContext) {}

  public url(): string {
    return this.ctx.website.urlOf(RoutePath.USER_LOGIN_PAGE);
  }

  public emailField(): Locator {
    return this.ctx.page.getByLabel("Please provide your email");
  }

  public sendMeAnOtpButton(): Locator {
    return this.ctx.page.getByRole("button", {
      name: "Send me an OTP",
    });
  }

  public otpSentMessage(): Locator {
    return this.ctx.page.getByText("An OTP has been sent to");
  }

  public otpField(): Locator {
    return this.ctx.page.getByLabel("Enter OTP");
  }

  public loginButton(): Locator {
    return this.ctx.page.getByRole("button", { name: "Login" });
  }

  public registerLink(): Locator {
    return this.ctx.page.getByRole("link", { name: "register here" });
  }

  public async doLogin(userEmail: string): Promise<UserMyPetsPage> {
    await this.emailField().fill(userEmail);
    await this.sendMeAnOtpButton().click();
    await expect(this.otpSentMessage()).toBeVisible();
    await this.otpField().fill("000000");
    await this.loginButton().click();
    const nextPage = new UserMyPetsPage(this.ctx);
    await expect(this.ctx.page).toHaveURL(nextPage.url());
    return nextPage;
  }
}
