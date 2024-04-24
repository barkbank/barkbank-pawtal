import { withDb } from "../_db_helpers"

describe("getDogStatuses", () => {
  it("WIP: should return ERROR_UNAUTHORIZED when the user does not own the requested dog", async () => {
    await withDb(async (dbPool) => {})
  })
  it("WIP: should return ERROR_MISSING_DOG when the requested dog does not exist", async () => {
    await withDb(async (dbPool) => {})
  })
  it("WIP: should return statuses of the requested dog", async () => {
    await withDb(async (dbPool) => {})
  })
})
