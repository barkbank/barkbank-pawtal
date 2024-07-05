#!/bin/bash

# Generate a BARK-? branch name

branchName=$(printf "BARK-%04d" $((RANDOM % 10000)))
while [ -n "$(git log --oneline --all | grep $branchName)" ]; do
    branchName=$(printf "BARK-%04d" $((RANDOM % 10000)))
done
echo $branchName
