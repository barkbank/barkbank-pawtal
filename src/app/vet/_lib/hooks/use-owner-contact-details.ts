import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { OwnerContactDetails } from "@/lib/bark/models/owner-contact-details";
import useSWR from "swr";

type DataType = Result<
  OwnerContactDetails,
  | typeof CODE.ERROR_NOT_LOGGED_IN
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.ERROR_NOT_PREFERRED_VET
  | typeof CODE.FAILED
>;

async function fetchOwnerContactDetails(dogIdKey: string): Promise<DataType> {
  if (dogIdKey === "") {
    return Err(CODE.ERROR_DOG_NOT_FOUND);
  }
  const url = RoutePath.API_VET_DOG_OWNER_DETAILS(dogIdKey);
  const res = await fetch(url);
  if (res.status !== 200) {
    if (res.status === 401) {
      return Err(CODE.ERROR_NOT_LOGGED_IN);
    }
    if (res.status === 403) {
      return Err(CODE.ERROR_NOT_PREFERRED_VET);
    }
    if (res.status === 404) {
      return Err(CODE.ERROR_DOG_NOT_FOUND);
    }
    return Err(CODE.FAILED);
  }
  const data: { ownerContactDetails: OwnerContactDetails } = await res.json();
  const { ownerContactDetails } = data;
  const { vetUserLastContactedTime, ...others } = ownerContactDetails;
  return Ok({
    ...others,
    vetUserLastContactedTime:
      vetUserLastContactedTime === null
        ? null
        : new Date(vetUserLastContactedTime),
  });
}

export function useOwnerContactDetails(dogId: string | null): {
  data?: DataType;
  isLoading: boolean;
} {
  const dogIdKey = dogId !== null ? dogId : "";
  const { data, isLoading } = useSWR<DataType>(
    dogIdKey,
    fetchOwnerContactDetails,
  );
  return { data, isLoading };
}
