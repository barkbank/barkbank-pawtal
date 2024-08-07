import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import React, { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { getMatchingItems } from "@/lib/utilities/get-matching-items";

export function BarkFormAutocomplete(props: {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  value?: string;
  suggestions: string[];
  placeholder?: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  onEmptyQuery?: "MATCH_NONE" | "MATCH_ALL" | undefined;
}) {
  const {
    form,
    name,
    label,
    value,
    suggestions,
    placeholder,
    description,
    children,
    onEmptyQuery,
  } = props;
  const [showList, setShowList] = useState<boolean>(false);
  const currentValue = value ?? "";
  const _onEmptyQuery = onEmptyQuery ?? "MATCH_NONE";
  const matches = _getMatches(currentValue, suggestions, _onEmptyQuery);
  console.log(`${matches.length} matches`);

  const onValueChange = (value: string) => {
    console.log(`onValueChange ${value}`);
    form.setValue(name, value);
    setShowList(true);
  };

  const onSelect = (value: string) => {
    console.log(`onSelect ${value}`);
    const selectedItem = suggestions.filter(
      (label) => label.toLowerCase() === value,
    );
    form.setValue(name, selectedItem[0]);
    setShowList(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          onBlur={() => setTimeout(() => setShowList(false), 200)}
          onFocus={() => setShowList(true)}
        >
          <FormLabel className="text-base">{label}</FormLabel>
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <FormControl>
                <Command>
                  <CommandInput
                    className="text-base"
                    placeholder={placeholder}
                    onValueChange={onValueChange}
                    value={currentValue}
                  />
                  {showList && (
                    <CommandList>
                      {matches.map((item) => (
                        <CommandItem
                          key={item}
                          value={item}
                          onSelect={onSelect}
                        >
                          {item}
                        </CommandItem>
                      ))}
                    </CommandList>
                  )}
                </Command>
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

function _getMatches(
  query: string | undefined,
  items: string[],
  onEmptyQuery: "MATCH_NONE" | "MATCH_ALL",
): string[] {
  if (!query) {
    if (onEmptyQuery === "MATCH_NONE") {
      return [];
    }
    return items;
  }
  return getMatchingItems<string>({
    query,
    items,
    getStrings: (item) => [item],
  });
}
