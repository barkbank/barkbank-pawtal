#!/bin/bash

if [ ! -d ../barkbank-schema ]; then
    echo "Cannot find the barkbank-schema directory"
    exit 1
fi

pushd ../barkbank-schema
make local-destroy
make local
popd
