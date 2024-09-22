#!/bin/bash

# Config
TICKET_PREFIX="BARK-"

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
    echo "${TICKET_PREFIX}${ticketNumber}"
}

# Find a branch name that isn't already on the Git Log
function getBranchName {
    local logs=$(git log --oneline --all | grep ${TICKET_PREFIX})
    local offset=0
    local limit=50
    local branchName=$(getRandomBranchName $offset $limit)
    while [ -n "$(echo ${logs} | grep $branchName\\b)" ]; do
	offset=$(($offset + 10))
        branchName=$(getRandomBranchName $offset $limit)
    done
    echo $branchName
}

function main {
    echo "Git Fetching..."
    git fetch --all --prune

    echo "Choosing a ticket name..."
    local branchName=$(getBranchName)

    echo "Selected ticket..."
    echo ${branchName}

    echo "Claiming the ticket..."
    git checkout -b ${branchName} origin/main
    git push -u origin ${branchName}
}

main
