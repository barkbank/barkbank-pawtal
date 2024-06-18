import { BarkButton } from "@/components/bark/bark-button";
import { RoutePath } from "@/lib/route-path";
import { DogViewerData } from "./dog-viewer-data";
import { StatusSection } from "./status-section";
import { ProfileSection } from "./profile-section";

export function DogViewer(props: { data: DogViewerData }) {
  const { data } = props;

  return (
    <div className="m-3 flex flex-col gap-3">
      <StatusSection data={data} />
      <ProfileSection data={data} />
      <BarkButton
        className="w-full md:w-40"
        variant="brandInverse"
        href={RoutePath.USER_MY_PETS}
      >
        Back to Pets
      </BarkButton>
    </div>
  );
}
