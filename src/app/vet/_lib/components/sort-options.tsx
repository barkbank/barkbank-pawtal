import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortOptions() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Age</SelectLabel>
          <SelectItem value="age_youngest_first">Youngest First</SelectItem>
          <SelectItem value="age_oldest_first">Oldest First</SelectItem>
          <SelectLabel>Weight</SelectLabel>
          <SelectItem value="weight_heaviest_first">Heaviest First</SelectItem>
          <SelectItem value="weight_lightest_first">Lightest First</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
