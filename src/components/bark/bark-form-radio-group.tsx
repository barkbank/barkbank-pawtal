import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { BarkFormOption } from "./bark-form-option";

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
        <FormItem className="space-y-3">
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
                    disabled={disabled}
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
                      <RadioGroupItem
                        value={option.value}
                        checked={option.value === field.value}
                      />
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
