import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import React from "react";

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
