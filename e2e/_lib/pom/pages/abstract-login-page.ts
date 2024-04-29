import { Locator } from "@playwright/test";
import { PomPage } from "../core/pom-page";

export abstract class AbstractLoginPage extends PomPage {
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

  invalidEmailErrorMessage(): Locator {
    return this.page().getByText('Invalid email');
  }

  otpCannotBeEmptyErrorMessage(): Locator {
    return this.page().getByText('OTP cannot be empty');
  }
}
