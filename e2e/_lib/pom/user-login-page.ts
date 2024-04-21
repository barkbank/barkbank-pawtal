import { Locator, expect } from "@playwright/test";
import { RoutePath } from "@/lib/route-path";
import { UserMyPetsPage } from "./user-my-pets-page";
import { PomContext } from "./pom-context";

export class UserLoginPage {
  public ctx: PomContext;
  public url: string;
  public emailField: Locator;
  public otpField: Locator;
  public sendMeAnOtpButton: Locator;
  public loginButton: Locator;
  public otpSentMessage: Locator;
  public registerLink: Locator;

  constructor(ctx: PomContext) {
    this.ctx = ctx;
    this.url = ctx.pawtal.urlOf(RoutePath.USER_LOGIN_PAGE);
    this.emailField = ctx.page.getByLabel("Please provide your email");
    this.otpField = ctx.page.getByLabel("Enter OTP");
    this.sendMeAnOtpButton = ctx.page.getByRole("button", {
      name: "Send me an OTP",
    });
    this.loginButton = ctx.page.getByRole("button", { name: "Login" });
    this.otpSentMessage = ctx.page.getByText("An OTP has been sent to");
    this.registerLink = ctx.page.getByRole("link", { name: "register here" });
  }

  public async login(userEmail: string): Promise<UserMyPetsPage> {
    await this.emailField.fill(userEmail);
    await this.sendMeAnOtpButton.click();
    await expect(this.otpSentMessage).toBeVisible();
    await this.otpField.fill("000000");
    await this.loginButton.click();
    const nextPage = new UserMyPetsPage(this.ctx);
    await expect(this.ctx.page).toHaveURL(nextPage.url);
    return nextPage;
  }
}
