#!/bin/bash

OUTPUT=$(grep -lR 'process[.]env' src | grep -v '^src/lib/app[.]ts$')
if [[ -z "$OUTPUT" ]]; then
    echo "PASS"
    exit 0
else
    echo "FAIL - The following files contain process.env"
    echo
    echo $OUTPUT
    echo
    exit 1
fi


