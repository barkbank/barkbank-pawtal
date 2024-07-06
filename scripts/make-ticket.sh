#!/bin/bash

# Generate a BARK-? branch name

modBase=100
branchName=$(printf "BARK-%d" $((RANDOM % $modBase)))
while [ -n "$(git log --oneline --all | grep $branchName\\b)" ]; do
    branchName=$(printf "BARK-%d" $((RANDOM % $modBase)))
done
echo $branchName
