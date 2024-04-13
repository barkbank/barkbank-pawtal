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
    <div className="flex flex-col place-items-center p-3">
      <div className="w-full max-w-80">
        <BarkH2>Logout</BarkH2>
        <BarkP>Are you sure you want to logout?</BarkP>
        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <Button
            className="w-full md:w-1/2"
            variant="brandInverse"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="w-full md:w-1/2"
            variant="brand"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
