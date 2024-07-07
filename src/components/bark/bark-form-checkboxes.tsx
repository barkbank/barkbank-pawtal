import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import React from "react";
import { BarkFormOption } from "./bark-form-option";

export function BarkFormCheckboxes(props: {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: BarkFormOption[];
  description?: string;
}) {
  const { form, name, label, options, description } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <div>
            <FormLabel className="text-base">{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          {options.map((option) => (
            <FormField
              key={option.value}
              control={form.control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={option.value}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([
                                ...(field.value ?? []),
                                option.value,
                              ])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== option.value,
                                ),
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
