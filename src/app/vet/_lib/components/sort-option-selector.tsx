import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ObjectValues } from "@/lib/utilities/object-values";

export const SORT_OPTION = {
  NIL: "NIL",
  AGE_YOUNGEST_FIRST: "AGE_YOUNGEST_FIRST",
  AGE_OLDEST_FIRST: "AGE_OLDEST_FIRST",
  WEIGHT_HEAVIEST_FIRST: "WEIGHT_HEAVIEST_FIRST",
  WEIGHT_LIGHTEST_FIRST: "WEIGHT_LIGHTEST_FIRST",
} as const;

export type SortOption = ObjectValues<typeof SORT_OPTION>;

export function SortOptionSelector(props: {
  onValueChange: (value: SortOption) => void;
}) {
  const { onValueChange } = props;
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Age</SelectLabel>
          <SelectItem value={SORT_OPTION.AGE_YOUNGEST_FIRST}>
            Youngest First
          </SelectItem>
          <SelectItem value={SORT_OPTION.AGE_OLDEST_FIRST}>
            Oldest First
          </SelectItem>
          <SelectLabel>Weight</SelectLabel>
          <SelectItem value={SORT_OPTION.WEIGHT_HEAVIEST_FIRST}>
            Heaviest First
          </SelectItem>
          <SelectItem value={SORT_OPTION.WEIGHT_LIGHTEST_FIRST}>
            Lightest First
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
