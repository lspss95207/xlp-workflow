It is a readme file 

install docker 


- pull image from online repository

~~~shell
$ docker pull ubuntu:16.04
~~~

- pull image from local registry




- local registry

將docker-compose.yml放入文件夾,並保持5000端口的暢通

~~~shell
$ docker-compose -f docker-compose.yml up
~~~

則會以attach的方式開啟registry.  

接下來欲測試Volume