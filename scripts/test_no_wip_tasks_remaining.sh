#!/bin/bash

OUTPUT=$(grep -R 'WIP' src tests db)
if [[ -z "$OUTPUT" ]]; then
    echo "PASS"
    exit 0
else
    echo "FAIL - The following WIP comments remain"
    echo
    grep --color=always -R 'WIP' src tests db
    echo
    exit 1
fi
