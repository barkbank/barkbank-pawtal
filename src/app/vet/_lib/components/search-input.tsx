import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ChangeEvent } from "react";

export function SearchInput(props: {
  query: string;
  handleSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSearchReset: () => void;
}) {
  const { query, handleSearchInputChange, handleSearchReset } = props;
  return (
    <div className="flex flex-row items-center gap-3">
      <Input
        type="text"
        placeholder="Search..."
        className="text-base"
        value={query}
        onChange={handleSearchInputChange}
      />
      <X className="cursor-pointer" onClick={handleSearchReset} />
    </div>
  );
}
