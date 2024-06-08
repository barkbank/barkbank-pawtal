export function getMatchingItems<T>(args: {
  query: string;
  items: T[];
  getStrings: (item: T) => string[];
}): T[] {
  const { query, items, getStrings } = args;
  const queryTokens = query.split(" ").map((x) => x.toLowerCase());
  const matchingItems = [];
  for (const item of items) {
    const itemTokens = getStrings(item).map((x) => x.toLocaleLowerCase());
    if (allNeedlesMatchOneToken(queryTokens, itemTokens)) {
      matchingItems.push(item);
    }
  }
  return matchingItems;
}

function allNeedlesMatchOneToken(
  needles: string[],
  haystack: string[],
): boolean {
  for (const needle of needles) {
    if (!matchesOneToken(needle, haystack)) {
      return false;
    }
  }
  return true;
}

function matchesOneToken(needle: string, haystack: string[]): boolean {
  for (const tok of haystack) {
    if (tok.includes(needle)) {
      return true;
    }
  }
  return false;
}
