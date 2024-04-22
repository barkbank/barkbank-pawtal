import { Locator, expect } from "@playwright/test";
import { RoutePath } from "@/lib/route-path";
import { UserMyPetsPage } from "./user-my-pets-page";
import { PawtalPage } from "./pawtal-page";

export class UserLoginPage extends PawtalPage {
  public url(): string {
    return this.website().urlOf(RoutePath.USER_LOGIN_PAGE);
  }

  public emailField(): Locator {
    return this.page().getByLabel("Please provide your email");
  }

  public sendMeAnOtpButton(): Locator {
    return this.page().getByRole("button", {
      name: "Send me an OTP",
    });
  }

  public otpSentMessage(): Locator {
    return this.page().getByText("An OTP has been sent to");
  }

  public otpField(): Locator {
    return this.page().getByLabel("Enter OTP");
  }

  public loginButton(): Locator {
    return this.page().getByRole("button", { name: "Login" });
  }

  public registerLink(): Locator {
    return this.page().getByRole("link", { name: "register here" });
  }

  public async doLogin(userEmail: string): Promise<UserMyPetsPage> {
    await this.emailField().fill(userEmail);
    await this.sendMeAnOtpButton().click();
    await expect(this.otpSentMessage()).toBeVisible();
    await this.otpField().fill("000000");
    await this.loginButton().click();
    const nextPage = new UserMyPetsPage(this.context());

    await expect(this.page()).toHaveURL(nextPage.url());
    return nextPage;
  }
}
