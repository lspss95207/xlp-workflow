This project is to create a workflow to build BigBlueButton, the video conference software as a Docker image.

Before using any of the instructions, one should check Docker Preference settings.

For Docker Desktop systems, one must go into Docker Preference -> Resources and set Memory to 4Gb.  

install docker


### Pull image from online repository

~~~shell
$ docker login
$ docker pull <image_name>
~~~
where <image_name> refers to 'juanluisbaptiste/bigbluebutton:2.0-beta0' from  
https://github.com/juanluisbaptiste/ansible-bigbluebutton](https://github.com/juanluisbaptiste/ansible-bigbluebutton

juanluisbaptiste has supported several features in Ansible-Roll-installed BigBlueButton platform.


### Start bbb after having the image
~~~shell
$ docker run <image_name> -d -it
~~~
Now the docker container is built. Use 
~~~shell
$ docker ps
~~~
to get the container's id, and use
~~~shell
$ docker exec <container_id> ./bbb-start.sh
~~~
to start bbb. 


### Local registry

Place docker-compose.yml in the file and allow 0.0.0.0:5000/tcp open

~~~shell
$ docker-compose -f docker-compose.yml up
~~~

  

### Docker register volume configuration

### Push image to local registry 

Open Docker-Desktop/Preferences/Docker-Engine and edit the file, adding:
~~~shell
"insecure-registries" : ["0.0.0.0:5000"]
~~~
while obeying json format. Then click "Apply and Restart". Now we can start pushing the image in the local registry. 
~~~shell
$ docker tag <image_name> 0.0.0.0:5000/<img_name>:<version_name> 
$ docker push <image_name> 
~~~



### Pull image from local registry
~~~shell
$docker pull 0.0.0.0:5000/<img_name>:<version_name> 
~~~



