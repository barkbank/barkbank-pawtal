import { VetAccountSpec } from "@/lib/bark/models/vet-models";
import { withBarkContext } from "../_context";
import { givenVet } from "../_given";
import { toSecureVetAccountSpec } from "@/lib/bark/mappers/to-secure-vet-account-spec";
import { SecureVetAccountDao } from "@/lib/bark/daos/secure-vet-account-dao";
import { toReEncryptedVetAccountFields } from "@/lib/bark/mappers/to-re-encrypted-vet-account-fields";
import { toVetAccount } from "@/lib/bark/mappers/to-vet-account";

describe("toReEncryptedVetAccountFields", () => {
  it("should maintain hash and re-encrypt fields", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context);
      const accountSpec: VetAccountSpec = {
        vetId,
        vetAccountEmail: "tom@greenfarm.com",
        vetAccountName: "Tom Green",
      };
      const secureSpec = await toSecureVetAccountSpec(context, accountSpec);
      const dao = new SecureVetAccountDao(context.dbPool);
      const secureAccount = await dao.insert({ secureSpec });
      const reEncrypted = await toReEncryptedVetAccountFields(
        context,
        secureAccount,
      );

      expect(reEncrypted.vetId).toEqual(secureAccount.vetId);
      expect(reEncrypted.vetAccountId).toEqual(secureAccount.vetAccountId);
      expect(reEncrypted.vetAccountHashedEmail).toEqual(
        secureAccount.vetAccountHashedEmail,
      );
      expect(reEncrypted.vetAccountEncryptedName).not.toEqual(
        secureAccount.vetAccountEncryptedName,
      );
      expect(reEncrypted.vetAccountEncryptedEmail).not.toEqual(
        secureAccount.vetAccountEncryptedEmail,
      );

      const decrypted1 = await toVetAccount(context, secureAccount);
      const decrypted2 = await toVetAccount(context, reEncrypted);
      expect(decrypted1).toMatchObject(decrypted2);
      expect(decrypted2).toMatchObject(decrypted1);
    });
  });
});
