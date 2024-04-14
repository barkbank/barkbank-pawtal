#!/bin/bash

OUTPUT=$(grep -R 'WIP' src tests db e2e)
if [[ -z "$OUTPUT" ]]; then
    echo "PASS"
    exit 0
else
    echo "FAIL - The following WIP comments remain"
    echo
    grep -n --color=always -R 'WIP' src tests db e2e
    echo
    exit 1
fi
