import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TODO: Filter options for consideration...
export function FilterOptions() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Exclude dogs contacted in the...</SelectLabel>
          <SelectItem value="ex_dogs_7d">dogs: 7 or more days ago</SelectItem>
          <SelectItem value="ex_dogs_14d">dogs: 14 or more days ago</SelectItem>
          <SelectItem value="ex_dogs_30d">dogs: 30 or more days ago</SelectItem>
          <SelectItem value="ex_dogs_90d">dogs: 90 or more days ago</SelectItem>
          <SelectLabel>Exclude owners contacted in the...</SelectLabel>
          <SelectItem value="ex_owners_7d">Last 7 days (owners)</SelectItem>
          <SelectItem value="ex_owners_14d">Last 14 days (owners)</SelectItem>
          <SelectItem value="ex_owners_30d">Last 30 days (owners)</SelectItem>
          <SelectItem value="ex_owners_90d">Last 90 days (owners)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
