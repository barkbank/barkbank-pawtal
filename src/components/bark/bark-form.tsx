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
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
        className="mt-3"
        autoComplete="off"
      >
        {children}
      </form>
    </Form>
  );
}

export function BarkFormHeader(props: { children: React.ReactNode }) {
  return <p className="mt-6 text-lg">{props.children}</p>;
}

export function BarkFormParagraph(props: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm text-muted-foreground">{props.children}</p>;
}

export function BarkFormErrorParagraph(props: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm text-destructive">{props.children}</p>;
}

// Use form.setError("root", {message: "..."}) to set the error.
export function BarkFormError(props: { form: UseFormReturn<any> }) {
  const { form } = props;
  return (
    <FormField
      control={form.control}
      name="root"
      render={({ field }) => <FormMessage className="mt-6" />}
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
        <FormItem className="mt-6">
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

// Field type should be a boolean.
export function BarkFormSingleCheckbox(props: {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  optionLabel: string;
  description?: string;
}) {
  const { form, name, label, optionLabel, description } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-6">
          <FormLabel className="text-base">{label}</FormLabel>
          <div className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="font-normal">{optionLabel}</FormLabel>
            </div>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export type BarkFormOption = {
  value: string;
  label: string;
  description?: string;
};

// TODO: Extract out the button layout into a BarkFormButtonRadioGroup
export function BarkFormRadioGroup(props: {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: BarkFormOption[];
  description?: string;
  layout?: "button" | "radio";
  disabled?: boolean;
}) {
  const { layout, form, name, label, options, description, disabled } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-6 space-y-3">
          <FormLabel className="text-base">{label}</FormLabel>
          <FormControl>
            {layout === "button" ? (
              <div className="flex space-x-2">
                {options.map((option) => (
                  <Button
                    variant={
                      field.value === option.value
                        ? "brandSelectedChoice"
                        : "brandChoice"
                    }
                    key={option.value}
                    type="button"
                    className="flex-grow"
                    onClick={async () => {
                      field.onChange(option.value);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            ) : (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col"
                disabled={disabled}
              >
                {options.map((option) => (
                  <FormItem
                    key={option.value}
                    className="flex items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={option.value} />
                    </FormControl>
                    <div>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                      {!!option.description && (
                        <FormDescription>{option.description}</FormDescription>
                      )}
                    </div>
                  </FormItem>
                ))}
              </RadioGroup>
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

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
          <div className="mb-4 mt-6">
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

export function BarkFormTextArea(props: {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
}) {
  const { form, name, label, placeholder, description } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-6">
          <FormLabel className="text-base">{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="resize-none text-base"
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// WIP: Remove BarkFormButton
/**
 * @deprecated Use BarkButton
 */
export function BarkFormButton(props: {
  children: React.ReactNode;
  className?: string;
  onClick: () => Promise<void>;
}) {
  const { children, onClick, className } = props;
  return (
    <Button
      type="button"
      className={cn("mt-6", className)}
      onClick={onClick}
      variant="brandInverse"
    >
      {children}
    </Button>
  );
}

// WIP: Remove this deprecated function
/**
 * @deprecated Use BarkButton type="submit" instead. BarkFormSubmitButton has a
 * mt-6 that makes it difficult to arrange when it is grouped with other buttons
 * (e.g. Cancel).
 */
export function BarkFormSubmitButton(props: {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { disabled, children, className } = props;
  return (
    <Button
      type="submit"
      variant="brand"
      className={cn("mt-6", className)}
      disabled={disabled ?? false}
    >
      {children}
    </Button>
  );
}

export function BarkFormSelect(props: {
  form: UseFormReturn<any>;
  options: BarkFormOption[];
  label: string;
  name: string;
  placeholder?: string;
  description?: string;
}) {
  const { form, label, name, options, placeholder, description } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-6">
          <FormLabel className="text-base">{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem key={option.label} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
