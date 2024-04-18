import { getVetFormOptions } from "@/app/_lib/get-vet-form-options";
import GeneralDogForm from "./_components/general-dog-form";
import APP from "@/lib/app";

export default async function Page() {
  const vetOptions = await APP.getDbPool().then(getVetFormOptions);
  return (
    <div className="m-3">
      <GeneralDogForm formTitle="Add Dog" vetOptions={vetOptions} />
    </div>
  );
}
