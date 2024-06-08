
export function getMatchingItems<T>(args: {
  query: string;
  items: T[];
  getTokens: (item: T) => string[];
}): T[] {
  const {query, items, getTokens} = args;
  const queryTokens = query.split(" ").map(x => x.toLowerCase());
  const matchingItems = [];
  for (const item of items) {
    const itemTokens = getTokens(item).map(x => x.toLocaleLowerCase());
    let numMatchingQueryTokens = 0;
    for (const queryTok in queryTokens) {
      let numMatchingItemTokens = 0;
      for (const itemTok in itemTokens) {
        if (itemTok.includes(queryTok)) {
          numMatchingItemTokens += 1;
        }
      }
      if (numMatchingItemTokens > 0) {
        numMatchingQueryTokens += 1;
      }
    }
    if (numMatchingQueryTokens > 0) {
      matchingItems.push(item);
    }
  }
  return matchingItems;
}
