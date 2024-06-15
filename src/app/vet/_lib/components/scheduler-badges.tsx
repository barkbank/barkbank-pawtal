import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";

export function ScheduledBadge() {
  return (
    <Badge className="vet-appointment-scheduler-scheduled-badge">
      Scheduled
    </Badge>
  );
}

export function DeclinedBadge() {
  return (
    <Badge
      className="vet-appointment-scheduler-declined-badge"
      variant="secondary"
    >
      Declined
    </Badge>
  );
}

export function RecentlyContactedBadge(props: { recentTime: Date }) {
  const { recentTime } = props;
  const whenText = formatDistance(recentTime, new Date(), {
    includeSeconds: false,
    addSuffix: true,
  });

  return (
    <Badge className="vet-appointment-scheduler-declined-badge bg-amber-600">
      Recently contacted {whenText}
    </Badge>
  );
}
