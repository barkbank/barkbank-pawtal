"use server";

import { BarkH1, BarkP } from "@/components/bark/bark-typography";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";

export default async function Page() {
  const loginOptions = [
    {
      label: "USER REGISTRATION",
      href: RoutePath.USER_REGISTRATION,
    },
    {
      label: "USER LOGIN",
      href: RoutePath.USER_LOGIN_PAGE,
    },
    {
      label: "VET LOGIN",
      href: RoutePath.VET_LOGIN_PAGE,
    },
    {
      label: "ADMIN LOGIN",
      href: RoutePath.ADMIN_LOGIN_PAGE,
    },
  ];
  return (
    <>
      <div className="p-6">
        <BarkH1>Bark Bank</BarkH1>
        <ul>
          {loginOptions.map((opt) => (
            <li className="mt-6" key={opt.label}>
              <Link key={opt.label} href={opt.href}>
                <div className="flex h-24 min-w-[180px] max-w-[360px] items-center justify-center rounded-md border-2 border-solid border-brand bg-brand-light shadow-md hover:bg-brand">
                  <p className="text-center text-xl">{opt.label}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
