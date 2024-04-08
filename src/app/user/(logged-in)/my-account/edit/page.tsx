import { BarkH2 } from "@/components/bark/bark-typography";
import AccountEditForm from "./_components/account-edit-form";

type SearchParams = {
  userName: string;
  userPhoneNumber: string;
  userResidency: string;
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="flex flex-col">
      <BarkH2>Edit My Account Details</BarkH2>
      <AccountEditForm defaultValues={searchParams} />
    </div>
  );
}
