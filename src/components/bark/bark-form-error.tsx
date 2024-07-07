import { UseFormReturn } from "react-hook-form";
import { FormField, FormMessage } from "../ui/form";

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
