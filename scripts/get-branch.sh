#!/bin/bash

branchName="BARK-$((RANDOM % 10000))"
while [ -n "$(git log --oneline --all | grep $branchName)" ]; do
    branchName="BARK-$((RANDOM % 10000))"
done
echo $branchName
