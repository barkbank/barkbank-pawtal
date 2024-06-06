"use client";

import { BarkButton } from "@/components/bark/bark-button";
import { BarkAppointment } from "@/lib/bark/models/bark-appointment";
import { useRouter } from "next/navigation";
import { RoutePath } from "@/lib/route-path";
import { useToast } from "@/components/ui/use-toast";
import { CODE } from "@/lib/utilities/bark-code";
import { capitalize } from "lodash";
import { postCancelAppointment } from "../actions/post-cancel-appointment";

export function CancelAppointmentForm(props: { appointment: BarkAppointment }) {
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
    <div className="prose">
      <h1>Cancel Appointment</h1>
      <p>
        Please confirm the cancellation of appointment with <b>{dogName}</b>, a{" "}
        <b>{capitalize(dogGender)}</b> <b>{dogBreed}</b> belonging to{" "}
        <b>{ownerName}</b>. (Appointment ID: {appointmentId})
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
  );
}
