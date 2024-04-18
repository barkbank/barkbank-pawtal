import { getVetFormOptions } from "@/app/_lib/get-vet-form-options";
import APP from "@/lib/app";
import AddDogForm from "./_components/add-dog-form";

export default async function Page() {
  const vetOptions = await APP.getDbPool().then(getVetFormOptions);
  return (
    <div className="m-3">
      <AddDogForm vetOptions={vetOptions} />
    </div>
  );
}
