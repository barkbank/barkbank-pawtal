"use client";

import { BarkButton } from "@/components/bark/bark-button";
import { BarkH1 } from "@/components/bark/bark-typography";
import { BarkAppointment } from "@/lib/bark/models/bark-appointment";
import { postCancelAppointment } from "../_actions/post-cancel-appointment";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { useToast } from "@/components/ui/use-toast";
import { CODE } from "@/lib/utilities/bark-code";

export function CancelReportForm(props: { appointment: BarkAppointment }) {
  const router = useRouter();
  const { toast } = useToast();
  const { appointment } = props;
  const { appointmentId, dogName, dogBreed, dogGender, ownerName } =
    appointment;

  const onConfirm = async () => {
    const res = await postCancelAppointment({ appointmentId });
    if (res === CODE.ERROR_NOT_LOGGED_IN) {
      router.push(RoutePath.VET_LOGIN_PAGE);
    }
    if (res !== CODE.OK) {
      toast({
        title: "Error",
        description: `Code: ${res}`,
        variant: "brandError",
      });
    }
    if (res === CODE.OK) {
      router.push(RoutePath.VET_APPOINTMENTS_LIST);
    }
  };

  const onDoNotCancel = async () => {
    router.push(RoutePath.VET_APPOINTMENTS_LIST);
  };

  return (
    <div className="flex flex-col gap-3">
      <BarkH1>Cancel Appointment?</BarkH1>
      <div className="flex w-full flex-col gap-3 md:w-2/3">
        <p>
          Please confirm cancellation of appointment{" "}
          <span className="font-semibold">{appointmentId}</span> for{" "}
          <span className="font-semibold">{dogName}</span>, a{" "}
          <span className="font-semibold">{dogGender}</span>{" "}
          <span className="font-semibold">{dogBreed}</span> belonging to{" "}
          <span className="font-semibold">{ownerName}</span>.
        </p>
        <div className="flex w-full flex-col gap-3 md:flex-row">
          <BarkButton
            className="w-full md:w-40"
            variant="brand"
            onClick={onConfirm}
          >
            Confirm
          </BarkButton>
          <BarkButton
            className="w-full md:w-40"
            variant="brandInverse"
            onClick={onDoNotCancel}
          >
            Do not cancel
          </BarkButton>
        </div>
      </div>
    </div>
  );
}
