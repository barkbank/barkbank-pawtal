import { CODE } from "@/lib/utilities/bark-code";
import { withService } from "./_service";

describe("addAppointment", () => {
  it("should return ERROR_DOG_NOT_FOUND when specified dog cannot be found", async () => {
    await withService(async ({ service }) => {
      const dogId = "12345";
      const vetId = "67890";
      const { result, error } = await service.addAppointment({ dogId, vetId });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
});
