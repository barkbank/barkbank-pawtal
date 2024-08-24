#!/bin/bash

# Generate a random branch within the specified limits.
#
# Branch name would be BARK-X where offset <= X < offset+limit.
#
# Args:
# - $1 is the offset
# - $2 is the limit
#
function getRandomBranchName {
    local offset=$1
    local limit=$2
    local ticketNumber=$(($offset + (RANDOM % $limit)))
    echo "BARK-${ticketNumber}"
}

# Find a branch name that isn't already on the Git Log
function getBranchName {
    local offset=1
    local limit=8
    local branchName=$(getRandomBranchName $offset $limit)
    while [ -n "$(git log --oneline --all | grep $branchName\\b)" ]; do
        # offset=$(($offset + $limit))
        limit=$(($limit * 2))
        branchName=$(getRandomBranchName $offset $limit)
    done
    echo $branchName
}

function main {
    echo "Git Fetching..."
    git fetch --all --prune

    echo "Choosing a ticket name..."
    local branchName=$(getBranchName)

    echo "Claiming the ticket..."
    git checkout -b ${branchName} origin/main
    git push -u origin ${branchName}
}

main
