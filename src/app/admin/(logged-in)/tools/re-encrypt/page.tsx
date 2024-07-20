"use client";

import { postReEncrypt } from "@/app/admin/_lib/actions/post-re-encrypt";
import { BarkError } from "@/components/bark/bark-error";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ReEncryptResult } from "@/lib/bark/models/re-encrypt-result";
import { useState } from "react";

export default function Page() {
  const { toast } = useToast();
  const [result, setResult] = useState<ReEncryptResult | {}>({});
  const [error, setError] = useState<string>("");
  const reEncrypt = async () => {
    toast({ variant: "default", title: "Re-encrypting..." });
    const { result, error } = await postReEncrypt();
    if (error !== undefined) {
      toast({ variant: "destructive", title: "Re-encryption failed" });
      setError(error);
      return;
    }
    toast({
      variant: "default",
      title: "Re-encryption successful",
    });
    setResult(result);
    setError("");
  };
  return (
    <div className="prose m-3">
      <h1>Re-encrypt</h1>
      <p>
        Use the Re-enrypt button below to re-enrypt all data with the latest
        key.
      </p>
      <Button
        variant="default"
        className="w-full p-6 md:w-40"
        type="button"
        onClick={reEncrypt}
      >
        Re-encrypt
      </Button>
      <p>Re-encryption Result</p>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      {error && <BarkError>{error}</BarkError>}
    </div>
  );
}
