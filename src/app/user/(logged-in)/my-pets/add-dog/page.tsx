import GeneralDogForm from "./_components/general-dog-form";

export default async function Page() {
  return (
    <div className="m-3">
      <GeneralDogForm formTitle="Add Dog" vetOptions={[]} />
    </div>
  );
}
