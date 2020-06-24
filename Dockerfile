FROM ubuntu:16.04

RUN apt-get update && apt-get install -y wget
RUN apt-get install -y lsb-release
RUN apt-get install -y sudo && apt-get\
 install -y git
RUN sudo su
ADD bbb-install.sh .
RUN chmod +x bbb-install.sh
RUN ./bbb-install.sh
