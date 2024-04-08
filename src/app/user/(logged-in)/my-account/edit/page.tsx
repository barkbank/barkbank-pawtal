import { BarkH2 } from "@/components/bark/bark-typography";

type SearchParams = {
  userName: string;
  userPhoneNumber: string;
  userResidency: string;
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="flex flex-col">
      <BarkH2>Edit My Account Details</BarkH2>
      <p>{JSON.stringify(searchParams)}</p>
    </div>
  );
}
