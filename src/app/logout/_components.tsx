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
    <div className="flex min-h-screen flex-col place-items-center p-6">
      <div className="prose w-full max-w-80">
        <h1>Logout</h1>
        <p>Are you sure you want to logout?</p>
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
