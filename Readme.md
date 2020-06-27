This project is to create a workflow to build BigBlueButton, the video conference software as a Docker image.

Before using any of the instructions, one should check Docker Preference settings.

For Docker Desktop systems, one must go into Docker Preference -> Resources and set Memory to 4Gb.  

install docker


- pull image from online repository

~~~shell
$ docker login
$ docker pull juanluisbaptiste/bigbluebutton:2.0-beta0
~~~

- start bbb after having the image
~~~shell
$ docker run <image_name> -it exec ./bbb-start.sh
~~~



- local registry

將docker-compose.yml放入文件夾,並保持5000端口的暢通

~~~shell
$ docker-compose -f docker-compose.yml up
~~~

則會以attach的方式開啟registry.  

接下來欲測試Volume

- push image to local registry 

Open docker-desktop/preferences/docker-engine and edit the json file, adding:
~~~shell
"insecure-registries" : ["0.0.0.0:5000"]
~~~

~~~shell
$ docker tag <image_name> 0.0.0.0:5000/<img_name>:<version_name> 
$ docker push <image_name> 
~~~

- pull image from local registry
~~~shell
$docker pull 0.0.0.0:5000/<img_name>:<version_name> 
~~~



