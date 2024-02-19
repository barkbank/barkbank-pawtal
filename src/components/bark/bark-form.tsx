import { Controller, UseFormReturn } from "react-hook-form";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
        className="mt-3 rounded border px-3 pb-6 shadow-md"
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
  type?: "text" | "password" | "number";
  placeholder?: string;
  description?: string;
}) {
  const { form, name, label, type, placeholder, description } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-6">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
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
          <FormLabel>{label}</FormLabel>
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
};

export function BarkFormRadioGroup(props: {
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
      render={({ field }) => (
        <FormItem className="mt-6 space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
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
              name="vaccinations"
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
                            ? field.onChange([...field.value, option.value])
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
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="resize-none"
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

export function BarkFormSubmitButton(props: { label?: string }) {
  const { label } = props;
  return (
    <Button type="submit" className="mt-6">
      {label || "Submit"}
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
  const [open, setOpen] = React.useState(false);

  const { form, label, name, options, placeholder, description } = props;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="mt-6 flex flex-col">
            <FormLabel>{label}</FormLabel>

            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {/* Convert to lowercase because shadcn convert current value to lowercase */}
                {field.value
                  ? options.find(
                      (option) => option.value.toLowerCase() === field.value,
                    )?.label
                  : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search breed..." />
                <CommandEmpty>No breed found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        console.log(currentValue);
                        field.onChange(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === option.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </Popover>
  );
}
