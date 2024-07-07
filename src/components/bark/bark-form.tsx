import { UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";
import React from "react";

export function BarkForm(props: {
  children: React.ReactNode;
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
}) {
  const { children, form, onSubmit } = props;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-3 flex flex-col gap-6"
        autoComplete="off"
      >
        {children}
      </form>
    </Form>
  );
}

export function BarkFormHeader(props: { children: React.ReactNode }) {
  return <p className="text-lg">{props.children}</p>;
}

export function BarkFormParagraph(props: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{props.children}</p>;
}

export function BarkFormErrorParagraph(props: { children: React.ReactNode }) {
  return <p className="text-sm text-destructive">{props.children}</p>;
}
