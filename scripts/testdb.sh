#!/bin/bash

set -e

mDockerImage=postgres:15.2
mContainerName=pawtaltestdb
mVolumeName=pawtaltestvolume

function testDbDown {
    docker stop ${mContainerName} 2> /dev/null || :
    docker remove ${mContainerName} 2> /dev/null || :
    docker volume rm ${mVolumeName} 2> /dev/null || :
}

function testDbUp {
    testDbDown
    docker run \
           --name ${mContainerName} \
           -e POSTGRES_PASSWORD=password \
           -p 5999:5432 \
           -v ${mVolumeName}:/var/lib/postgresql/data \
           -d \
           $mDockerImage
    sleep 3
}

$@
