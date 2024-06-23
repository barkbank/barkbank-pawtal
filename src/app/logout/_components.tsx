"use client";

import { BarkButton } from "@/components/bark/bark-button";
import { BarkH2, BarkP } from "@/components/bark/bark-typography";
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
          <BarkButton
            className="w-full md:w-1/2"
            variant="brandInverse"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </BarkButton>
          <BarkButton
            className="w-full md:w-1/2"
            variant="brand"
            onClick={onLogout}
            type="button"
          >
            Logout
          </BarkButton>
        </div>
      </div>
    </div>
  );
}
