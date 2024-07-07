import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
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

// Use form.setError("root", {message: "..."}) to set the error.
export function BarkFormError(props: { form: UseFormReturn<any> }) {
  const { form } = props;
  return (
    <FormField
      control={form.control}
      name="root"
      render={({ field }) => <FormMessage />}
    />
  );
}

export function BarkFormInput(props: {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  type?: "text" | "password" | "number" | "email";
  placeholder?: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
}) {
  const { form, name, label, type, placeholder, description, children } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">{label}</FormLabel>
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <FormControl>
                <Input
                  className="text-base"
                  placeholder={placeholder}
                  type={type}
                  {...field}
                />
              </FormControl>
            </div>
            {children}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
