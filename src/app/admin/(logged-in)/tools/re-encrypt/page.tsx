"use client";

import { postReEncrypt } from "@/app/admin/_lib/actions/post-re-encrypt";
import { BarkButton } from "@/components/bark/bark-button";
import { BarkError } from "@/components/bark/bark-error";
import { useToast } from "@/components/ui/use-toast";
import { ReEncryptResult } from "@/lib/bark/models/re-encrypt-result";
import { useState } from "react";

export default function Page() {
  const { toast } = useToast();
  const [result, setResult] = useState<ReEncryptResult | {}>({});
  const [error, setError] = useState<string>("");
  const reEncrypt = async () => {
    toast({ variant: "brandInfo", title: "Re-encrypting..." });
    const { result, error } = await postReEncrypt();
    if (error !== undefined) {
      toast({ variant: "brandError", title: "Re-encryption failed" });
      setError(error);
      return;
    }
    const { numRecords, numValues } = result;
    toast({
      variant: "brandSuccess",
      title: "Re-encryption successful",
      description: `Processed ${numRecords} records and encrypted ${numValues} values.`,
    });
    setResult(result);
  };
  return (
    <div className="prose m-3">
      <h1>Re-encrypt</h1>
      <p>
        Use the Re-enrypt button below to re-enrypt all data with the latest
        key.
      </p>
      <BarkButton
        variant="brand"
        className="w-full md:w-40"
        type="button"
        onClick={reEncrypt}
      >
        Re-encrypt
      </BarkButton>
      <p>Re-encryption Result</p>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      {error && <BarkError>{error}</BarkError>}
    </div>
  );
}
