import { opFetchAppointment } from "@/lib/bark/operations/op-fetch-appointment";
import { withBarkContext } from "../_context";
import { CODE } from "@/lib/utilities/bark-code";

describe("opFetchAppointment", () => {
  it("should return ERROR_APPOINTMENT_NOT_FOUND when specified appointment does not exist", async () => {
    await withBarkContext(async ({ context }) => {
      const appointmentId = "123";
      const { result, error } = await opFetchAppointment(context, {
        appointmentId,
      });
      expect(error).toEqual(CODE.ERROR_APPOINTMENT_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
});
