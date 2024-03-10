"use server";

import { BarkH1, BarkP } from "@/components/bark/bark-typography";
import { RoutePath } from "@/lib/route-path";
import Link from "next/link";

export default async function Page() {
  const loginOptions = [
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
        <BarkP>Please select one of the following login options.</BarkP>
        <ul>
          {loginOptions.map((opt) => (
            <li className="mt-6" key={opt.label}>
              <Link key={opt.label} href={opt.href}>
                <div className="flex h-24 w-48 items-center justify-center rounded-md bg-gray-200 hover:bg-gray-100">
                  <p className="text-xl">{opt.label}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
