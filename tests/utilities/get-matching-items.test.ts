import { getMatchingItems } from "@/lib/utilities/get-matching-items";

describe("getMatchingItems", () => {
  type SomeType = {
    name: string;
    power: string;
  };

  function getSomeTokens(something: SomeType): string[] {
    const nameTokens = something.name.split(" ");
    const powerTokens = something.power.split(" ");
    return nameTokens.concat(powerTokens);
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
      getTokens: getSomeTokens,
      query,
    });
  }

  it("should return matching items", () => {
    expect(search("calling")).toEqual([BERNARD, BERNICE]);
    expect(search("bern")).toEqual([BERNARD, BERNICE]);
    expect(search("ing")).toEqual([ALICIA, BERNARD, BERNICE]);
    expect(search("alicia")).toEqual([ALICIA]);
    expect(search("bern cold")).toEqual([BERNARD]);
  });
});
