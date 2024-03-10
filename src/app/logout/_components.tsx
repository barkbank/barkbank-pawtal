"use client";

import { BarkH2, BarkP } from "@/components/bark/bark-typography";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LogoutQuestion() {
  const router = useRouter();
  const onCancel = () => {
    router.back();
  };
  const onLogout = () => {
    signOut();
  };
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between">
        <div className="mx-auto max-w-[1100px] sm:w-[36rem] sm:px-6 sm:py-10 md:w-full ">
          <BarkH2>Logout</BarkH2>
          <BarkP>Are you sure you want to logout?</BarkP>
          <div className="mt-6 flex flex-row gap-3">
            <Button variant="brandInverse" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="brand" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
