import Image from "next/image";
import { BarkH1 } from "../bark-typography";

const LoginLayout = ({
  accountType,
  children,
}: Readonly<{ accountType: string; children: React.ReactNode }>) => {
  let logoSrc = "";

  if (accountType === "ADMIN") {
    logoSrc = "/purpleDogHouse.svg";
  } else if (accountType === "VET") {
    logoSrc = "/pawPrint.svg";
  } else if (accountType === "USER") {
    logoSrc = "/orangeDogHouse.svg";
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-evenly">
      {/* Hero Section */}
      <div className="flex flex-col items-center border-b px-6 pb-10 sm:mt-0">
        <Image
          src={logoSrc}
          alt="" // Decorative image so alt text is empty
          height={100}
          width={100}
        />
        <div className="mt-4">
          <BarkH1>Bark Bank Canine Blood Donation Pawtal</BarkH1>
        </div>
      </div>
      <div className="px-6">{children}</div>
      {/* Footer */}
      <div className=""></div>
    </div>
  );
};

export default LoginLayout;
