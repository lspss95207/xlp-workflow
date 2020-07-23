#!/usr/bin/env bash

echo $USER

BASH_OPTION=bash

docker run -it \
	-p 80:80/tcp \
       	-p 1935:1935 \
	-p 3478:3478 \
	-p 3478:3478/udp \
	-v /home/$USER/dev/xlp-workflow/:/home/dev/xlp-workflow/ \
	--privileged \
	--rm \
	lspss95207/bigbluebutton-raw-ubuntu:2.2.20 \
	/sbin/init
	$BASH_OPTION
