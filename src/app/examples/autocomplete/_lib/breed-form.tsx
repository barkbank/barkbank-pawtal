"use client";

import { BarkButton } from "@/components/bark/bark-button";
import { BarkForm } from "@/components/bark/bark-form";
import { BarkFormAutocomplete } from "@/components/bark/bark-form-autocomplete";
import { BarkFormInput } from "@/components/bark/bark-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormDataSchema = z.object({
  dogBreed: z.string(),
});

type FormData = z.infer<typeof FormDataSchema>;

export function BreedForm(props: { breeds: string[] }) {
  const { breeds } = props;
  const form = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: { dogBreed: "" },
  });

  const onSubmit = async (values: FormData) => {
    console.log({ values });
  };

  const currentValues = form.watch();

  return (
    <div className="prose">
      <h1>Breed Form</h1>
      <p>
        Example for autocomplete. There are {breeds.length} dog breeds from
        which to select.
      </p>
      <BarkForm form={form} onSubmit={onSubmit}>
        <BarkFormAutocomplete form={form} name="dogBreed" label="Dog Breed" suggestions={breeds} />
        <BarkButton type="submit" variant="brand">
          Submit
        </BarkButton>
      </BarkForm>
      <pre>{JSON.stringify(currentValues, null, 2)}</pre>
    </div>
  );
}
