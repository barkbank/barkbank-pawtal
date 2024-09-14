#!/bin/bash

# Generate the list of numbers
numbers=$(git log --oneline --all | cut -d ' ' -f2 | grep BARK | cut -d ':' -f1 | sort | uniq | cut -d '-' -f2 | sort -n)

# Process the numbers and create the histogram
echo "$numbers" | awk '
{
  bin_size = 10;
  bin = int($1 / bin_size) * bin_size;
  bins[bin]++;
}
END {
  for (bin in bins) {
    printf("%04d: ", bin);
    for (i = 0; i < bins[bin]; i++) {
      printf("#");
    }
    printf("\n");
  }
}' | sort
