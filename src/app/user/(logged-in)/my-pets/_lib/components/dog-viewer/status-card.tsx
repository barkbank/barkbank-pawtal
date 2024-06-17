import { BarkDogAvatar } from "@/components/bark/bark-dog-avatar";
import { BarkStatusBlock } from "@/components/bark/bark-status-block";
import { DogViewerData } from "./dog-viewer-data";

export function StatusCard(props: { data: DogViewerData }) {
  const { dogName, dogGender } = props.data.dogProfile;
  const { dogStatuses, dogAppointments } = props.data;
  return (
    <div className="x-card flex flex-row gap-3">
      <BarkDogAvatar gender={dogGender} className="h-16 w-16 md:h-24 md:w-24" />
      <div className="flex flex-col items-start justify-center gap-3">
        <h1 className="text-3xl">{dogName}</h1>
        <BarkStatusBlock
          dogName={dogName}
          dogStatuses={dogStatuses}
          dogAppointments={dogAppointments}
        />
      </div>
    </div>
  );
}
