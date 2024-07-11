"use client";

import { BarkButton } from "@/components/bark/bark-button";

export default function Page() {
  const reEncrypt = async () => {
    // WIP: Write a bark op
    // WIP: Call the bark op from a server action
    // WIP: Have this onClick handler call the server action.
    // WIP: Show a toast when starting and show a toast when completed.
  };
  return (
    <div className="prose m-3">
      <h1>Re-encrypt</h1>
      <p>
        Use the Re-enrypt button below to re-enrypt all data with the latest
        key.
      </p>
      <BarkButton variant="brand" type="button" onClick={reEncrypt}>
        Re-encrypt
      </BarkButton>
    </div>
  );
}
