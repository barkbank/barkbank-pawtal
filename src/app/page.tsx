"use server";

import { BarkH1, BarkP } from "@/components/bark/bark-typography";
import { Button } from "@/components/ui/button";
import { RoutePath } from "@/lib/routes";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <BarkH1>Bark Bank</BarkH1>
      <BarkP>This is a public area.</BarkP>
      <Link href={RoutePath.LOGIN_PAGE}>
        <Button>Login</Button>
      </Link>
    </>
  );
}
