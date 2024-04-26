#!/bin/bash

if [[ -z $(git status -s) ]]; then
    exit 0
fi

exit 1
