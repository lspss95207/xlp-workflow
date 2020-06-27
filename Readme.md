This project is to create a workflow to build BigBlueButton, the video conference software.

## install developer version

> Referrence: https://www.jianshu.com/p/4ec45e8eae5e

### environment

- Ubuntu 16.04 x64.
- You can loggin as root.
- More than 4GB memory.
- More than 4 CPUs.

### install

``` bash
wget https://ubuntu.bigbluebutton.org/bbb-install.sh
chmod 744 bbb-install.sh
sudo ./bbb-install.sh -v xenial-220 -a
```
Then, use `bbb-conf --secret` to get the address of the website.  
For example:

``` bash
    URL: http://192.168.0.102/bigbluebutton/
    Secret: tX6iL78oKtkYODBznclOkFeVkLvriDbsbx33XznhCs

    Link to the API-Mate:
    https://mconf.github.io/api-mate/#server=http://192.168.0.102/bigbluebutton/&sharedSecret=tX6iL78oKtkYODBznclOkFeVkLvriDbsbx33XznhCs
```

Then you can visit the website on 192.168.0.102, and try a meeting session.

You may find that the website cannot access audio and video. Don't worry, I don't know how to fix that. Just ignore those annoying issues, and focus on developing chatting room.

If the chatting room has no problem, make a folder and run

``` bash
git clone https://github.com/bigbluebutton/bigbluebutton.git
```

After that, follow the steps on https://docs.bigbluebutton.org/2.2/dev.html. Then the development environment is set up.

## install docker version

Before using any of the instructions, one should check Docker Preference settings.

For Docker Desktop systems, one must go into Docker Preference -> Resources and set Memory to 4Gb.  

### Pull image from online repository

~~~shell
$ docker login
$ docker pull <image_name>
~~~
where <image_name> refers to __juanluisbaptiste/bigbluebutton:2.0-beta0__ from  
https://github.com/juanluisbaptiste/ansible-bigbluebutton](https://github.com/juanluisbaptiste/ansible-bigbluebutton

___juanluisbaptiste___ has supported several features in Ansible-Roll-installed BigBlueButton platform.


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



