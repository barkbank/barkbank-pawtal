import { RegistrationRequest } from "@/lib/bark/models/registration-models";
import { getRegistrationService } from "../../_fixtures";
import { withBarkContext } from "../_context";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import {
  parseCommonDate,
  parseCommonDateTime,
  SINGAPORE_TIME_ZONE,
} from "@/lib/utilities/bark-time";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { DOG_ANTIGEN_PRESENCE } from "@/lib/bark/enums/dog-antigen-presence";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { dbQuery } from "@/lib/data/db-utils";
import { opIndexDonorSnapshots } from "@/lib/bark/operations/op-index-donor-snapshots";

describe("opIndexDonorSnapshots", () => {
  it("takes a snapshot of all donors", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;
      const rs = getRegistrationService(dbPool);
      await rs.addUserAndDog(
        _mockRequest({ userEmail: "u1@u.com", dogBreed: "Breed1" }),
      );
      await rs.addUserAndDog(
        _mockRequest({ userEmail: "u2@u.com", dogBreed: "Breed2" }),
      );
      await opIndexDonorSnapshots(context, {
        referenceDate: parseCommonDateTime(
          "9 Aug 2024, 23:59",
          SINGAPORE_TIME_ZONE,
        ),
      });
      const sql = `
      SELECT dog_breed as "dogBreed"
      FROM donor_snapshots
      ORDER BY dog_breed ASC
      `;
      const res = await dbQuery<{ dogBreed: string }>(dbPool, sql, []);
      expect(res.rows[0].dogBreed).toEqual("Breed1");
      expect(res.rows[1].dogBreed).toEqual("Breed2");
      expect(res.rows.length).toEqual(2);
    });
  });
});

function _mockRequest(
  overrides?: Partial<RegistrationRequest>,
): RegistrationRequest {
  const base: RegistrationRequest = {
    emailOtp: "",
    userTitle: USER_TITLE.MDM,
    userName: "Honey MA",
    userEmail: "honey@ma.mail.com",
    userPhoneNumber: "12345678",
    userResidency: USER_RESIDENCY.SINGAPORE,
    dogName: "Felix Alexander",
    dogBreed: "Dobe VXI",
    dogBirthday: parseCommonDate("8 Mar 2024", SINGAPORE_TIME_ZONE),
    dogGender: DOG_GENDER.MALE,
    dogWeightKg: 15,
    dogDea1Point1: DOG_ANTIGEN_PRESENCE.UNKNOWN,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    dogPreferredVetId: undefined,
  };
  return { ...base, ...overrides };
}
