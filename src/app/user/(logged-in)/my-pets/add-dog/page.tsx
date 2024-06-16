import { getVetFormOptions } from "@/app/_lib/get-vet-form-options";
import APP from "@/lib/app";
import AddDogFormController from "../_lib/components/add-dog-form-controller";

export default async function Page() {
  const vetOptions = await APP.getDbPool().then(getVetFormOptions);
  return (
    <div className="m-3">
      <AddDogFormController vetOptions={vetOptions} />
    </div>
  );
}
