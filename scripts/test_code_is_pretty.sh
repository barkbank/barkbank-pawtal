#!/bin/bash

# Run prettier
npm run fmt

# If there are no changes, it is all okay.
if [[ -z $(git status -s) ]]; then
    echo "Okay"
    exit 0
fi

# Print debugging information otherwise.
echo "=== git diff ==="
git diff

echo "=== git status ==="
git status

echo "=== instruction ==="
echo "run 'make fmt' or 'npm run fmt' to address the above formatting issues"

exit 1
