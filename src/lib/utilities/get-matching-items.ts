export function getMatchingItems<T>(args: {
  query: string;
  items: T[];
  getStrings: (item: T) => string[];
}): T[] {
  const { query, items, getStrings } = args;
  const queryTokens = query.split(" ").map((x) => x.toLowerCase());
  const matchingItems = [];
  for (const item of items) {
    const itemStrings = getStrings(item).map((x) => x.toLowerCase());
    if (allNeedlesMatchAtLeastOneString(queryTokens, itemStrings)) {
      matchingItems.push(item);
    }
  }
  return matchingItems;
}

function allNeedlesMatchAtLeastOneString(
  needles: string[],
  haystack: string[],
): boolean {
  for (const needle of needles) {
    if (!matchesAtLeastOneString(needle, haystack)) {
      return false;
    }
  }
  return true;
}

function matchesAtLeastOneString(needle: string, haystack: string[]): boolean {
  for (const stringValue of haystack) {
    if (stringValue.includes(needle)) {
      return true;
    }
  }
  return false;
}
