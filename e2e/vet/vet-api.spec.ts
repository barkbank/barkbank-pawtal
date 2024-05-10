import { test, expect } from "@playwright/test";
import { loginKnownVet } from "../_lib/init/login-known-vet";
import { initPomContext } from "../_lib/init/init-pom-context";
import { RoutePath } from "@/lib/route-path";
import { ApiClient } from "../_lib/pom/api/api-client";

test.describe("/api/vet/dog-owners/[dogId]", () => {
  test("it returns 401 when not a logged-in vet", async ({ page, request }) => {
    const context = await initPomContext({ page });
    const api = new ApiClient(context, request);
    const rows = await api.sql(
      `SELECT dog_id as "dogId" FROM dogs LIMIT 1`,
      [],
    );
    const { dogId } = rows[0];
    const res = await request.get(
      context.website.urlOf(RoutePath.API_VET_DOG_OWNER_DETAILS(dogId)),
    );
    const data = await res.json();
    expect(res.status()).toEqual(401);
    expect(data).toEqual({});
  });
  test("it returns 404 when logged-in but dogId is invalid", async ({
    page,
    request,
  }) => {
    const { context } = await loginKnownVet({ page });
    const api = new ApiClient(context, request);
    const res = await api.get(RoutePath.API_VET_DOG_OWNER_DETAILS("9999999"));
    const data = await res.json();
    expect(data).toEqual({});
    expect(res.status()).toEqual(404);
  });
  test("it returns 403 when logged-in but dog preferred vet is different", async ({
    page,
    request,
  }) => {
    // Login the known vet.
    const {
      context,
      knownVet: { vetEmail },
    } = await loginKnownVet({ page });
    const api = new ApiClient(context, request);

    // Find a dog that does not prefer the known vet.
    const sql = `
    SELECT dog_id as "dogId"
    FROM dogs
    WHERE dog_id NOT IN (
      SELECT dog_id
      FROM dog_vet_preferences
      WHERE vet_id IN (
        SELECT vet_id FROM vets WHERE vet_email = $1
      )
    )
    LIMIT 1
    `;
    const { dogId } = (await api.sql(sql, [vetEmail]))[0];

    // Try to retrieve owner details for that dog
    const res = await api.get(RoutePath.API_VET_DOG_OWNER_DETAILS(dogId));

    // Expect 403 forbidden
    expect(res.status()).toEqual(403);

    // And empty JSON body
    const data = await res.json();
    expect(data).toEqual({});
  });
});
