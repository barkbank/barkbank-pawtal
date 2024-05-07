import { OwnerContactDetails } from "@/lib/vet/vet-models";
import useSWR from "swr";

async function fetchOwnerContactDetails(
  dogIdKey: string,
): Promise<OwnerContactDetails | undefined> {
  if (dogIdKey === "") {
    return undefined;
  }
  const url = `/api/vet/dog-owners/${dogIdKey}`;
  const res = await fetch(url);
  const data: { ownerContactDetails: OwnerContactDetails } = await res.json();
  const { ownerContactDetails } = data;
  const { vetUserLastContactedTime, ...others } = ownerContactDetails;
  return {
    ...others,
    vetUserLastContactedTime:
      vetUserLastContactedTime === null
        ? null
        : new Date(vetUserLastContactedTime),
  };
}

export function useOwnerContactDetails(dogId: string | null): {
  data?: OwnerContactDetails;
  isLoading: boolean;
} {
  const dogIdKey = dogId !== null ? dogId : "";
  const { data, isLoading } = useSWR<OwnerContactDetails | undefined>(
    dogIdKey,
    fetchOwnerContactDetails,
  );
  return { data, isLoading };
}
