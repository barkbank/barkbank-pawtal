import { Badge } from "@/components/ui/badge";

export function ScheduledBadge() {
  return <Badge className="vet-appointment-scheduler-scheduled-badge">Scheduled</Badge>;
}

export function DeclinedBadge() {
  return <Badge className="vet-appointment-scheduler-declined-badge" variant="secondary">Declined</Badge>;
}
