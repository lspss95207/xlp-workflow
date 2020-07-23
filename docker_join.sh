#!/usr/bin/env bash
#
# Typical usage: ./join.bash subt
#

BASH_OPTION=bash

IMG=lspss95207/bigbluebutton-raw-ubuntu:2.2.20

xhost +
containerid=$(docker ps -qf "ancestor=${IMG}") && echo $containerid
docker exec -it \
    --privileged \
    ${containerid} \
    $BASH_OPTION
xhost - 
