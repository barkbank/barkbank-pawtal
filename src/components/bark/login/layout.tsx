import Image from "next/image";
import { BarkH1 } from "../bark-typography";
import { BarkNavRoute } from "../bark-nav";
import Link from "next/link";

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

  const footerRoutes: BarkNavRoute[] = [
    {
      label: "Contact us",
      href: "/contact-us",
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: "Terms & Conditions",
      href: "/terms-and-conditions",
    },
  ];

  return (
    <div className="relative mt-40 flex min-h-screen w-full flex-col justify-between">
      {/* Hero Section */}
      <div className="flex flex-col items-center px-6 pb-10 sm:mt-0">
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
      <div className="border px-6 py-10 sm:py-64">{children}</div>
      {/* Footer */}
      <div className="bg-grey mt-10 flex min-h-[100px] items-center justify-center sm:min-h-[200px]">
        <div className="flex justify-between sm:w-[40%] ">
          {footerRoutes.map((route) => {
            return (
              <Link
                key={route.label}
                href={route.href}
                className="w-20 sm:w-full"
              >
                {route.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
