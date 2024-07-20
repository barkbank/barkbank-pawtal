"use client";

import { BarkBackLink } from "@/components/bark/bark-back-link";
import { RoutePath } from "@/lib/route-path";

export default function Page() {
  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_VETS_PAGE} />
      <div className="prose">
        <h1>Add Vet Clinic</h1>
        <p>Fill in the form below to create a new Vet Clinic</p>
      </div>
    </div>
  );
}
