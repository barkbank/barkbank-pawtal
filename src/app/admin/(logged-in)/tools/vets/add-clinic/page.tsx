"use client";

import { postVetClinicSpec } from "@/app/admin/_lib/actions/post-vet-clinic-spec";
import { BarkBackLink } from "@/components/bark/bark-back-link";
import { BarkForm } from "@/components/bark/bark-form";
import { BarkFormInput } from "@/components/bark/bark-form-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  VetClinicSpec,
  VetClinicSpecSchema,
} from "@/lib/bark/models/vet-models";
import { RoutePath } from "@/lib/route-path";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<VetClinicSpec>({
    resolver: zodResolver(VetClinicSpecSchema),
    defaultValues: {
      vetEmail: "",
      vetName: "",
      vetPhoneNumber: "",
      vetAddress: "",
    },
  });
  const onSubmit = async (spec: VetClinicSpec) => {
    const { error } = await postVetClinicSpec({ spec });
    if (error !== undefined) {
      toast({ variant: "destructive", title: "Error", description: error });
      return;
    }
    toast({ variant: "default", title: "Created Vet Clinic" });
    router.push(RoutePath.ADMIN_TOOLS_VETS_LIST_CLINICS);
  };
  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_VETS_LIST_CLINICS} />
      <div className="prose">
        <h1>Add Vet Clinic</h1>
        <p>Fill in the form below to create a new Vet Clinic</p>
      </div>
      <BarkForm form={form} onSubmit={onSubmit}>
        <BarkFormInput
          form={form}
          type="text"
          name="vetEmail"
          label="Clinic Email"
        />
        <BarkFormInput
          form={form}
          type="text"
          name="vetName"
          label="Clinic Name"
        />
        <BarkFormInput
          form={form}
          type="text"
          name="vetPhoneNumber"
          label="Clinic Phone Number"
        />
        <BarkFormInput
          form={form}
          type="text"
          name="vetAddress"
          label="Clinic Address"
        />
        <Button type="submit" className="w-full p-6 md:w-40">
          Submit
        </Button>
      </BarkForm>
    </div>
  );
}
