import { getMatchingItems } from "@/lib/utilities/get-matching-items";

describe("getMatchingItems", () => {
  type SomeType = {
    name: string;
    power: string;
  };

  function getSomeTokens(something: SomeType): string[] {
    const { name, power } = something;
    return [name, power];
  }

  const ALICIA = {
    name: "Alicia",
    power: "Ghosting",
  };

  const BERNARD = {
    name: "Bernard",
    power: "Cold Calling",
  };

  const BERNICE = {
    name: "Bernice",
    power: "Frequent Calling",
  };

  const GIVEN_PERSONS: SomeType[] = [ALICIA, BERNARD, BERNICE];

  function search(query: string): SomeType[] {
    return getMatchingItems({
      items: GIVEN_PERSONS,
      getStrings: getSomeTokens,
      query,
    });
  }

  it("should match everything when query is empty string", () => {
    expect(search("")).toEqual([ALICIA, BERNARD, BERNICE]);
  });

  it("should return matching items", () => {
    expect(search("calling")).toEqual([BERNARD, BERNICE]);
    expect(search("bern")).toEqual([BERNARD, BERNICE]);
    expect(search("ing")).toEqual([ALICIA, BERNARD, BERNICE]);
    expect(search("alicia")).toEqual([ALICIA]);
    expect(search("bern cold")).toEqual([BERNARD]);
  });
});
