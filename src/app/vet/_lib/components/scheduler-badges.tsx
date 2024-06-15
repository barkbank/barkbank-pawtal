import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";

export function ScheduledBadge() {
  return (
    <Badge className="vet-appointment-scheduler-scheduled-badge">
      Scheduled
    </Badge>
  );
}

export function DeclinedBadge(props: { dogLastContactedTime?: Date | null }) {
  const { dogLastContactedTime } = props;
  const whenTime = dogLastContactedTime ?? null;
  const whenText =
    whenTime === null
      ? null
      : formatDistance(whenTime, new Date(), {
          includeSeconds: false,
          addSuffix: true,
        });

  return (
    <Badge
      className="vet-appointment-scheduler-declined-badge"
      variant="secondary"
    >
      Declined {whenText}
    </Badge>
  );
}
