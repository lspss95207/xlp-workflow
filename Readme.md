This project is to create a workflow to build BigBlueButton, the video conference software.

## install developer version

> Referrence: https://www.jianshu.com/p/4ec45e8eae5e

### environment

- Ubuntu 16.04 x64.
- You can loggin as root.
- More than 4GB memory.
- More than 4 CPUs.

### install

#### install server
``` bash
wget https://ubuntu.bigbluebutton.org/bbb-install.sh
chmod 744 bbb-install.sh
sudo ./bbb-install.sh -v xenial-220 -a
```
Then, use `bbb-conf --secret` to get the address of the website. (If the server is not started, run `bbb-conf --start`)  
For example:

``` bash
    URL: http://192.168.0.102/bigbluebutton/
    Secret: tX6iL78oKtkYODBznclOkFeVkLvriDbsbx33XznhCs

    Link to the API-Mate:
    https://mconf.github.io/api-mate/#server=http://192.168.0.102/bigbluebutton/&sharedSecret=tX6iL78oKtkYODBznclOkFeVkLvriDbsbx33XznhCs
```

Then you can visit the website on 192.168.0.102, and try a meeting session.

You may find that the website cannot access audio and video. Don't worry, I don't know how to fix that. Just ignore those annoying issues, and focus on developing chatting room.

#### set up development environment

If the chatting room has no problem, it means we have a runnable service, and all we need is to set up the development environment.

> Referrence: https://docs.bigbluebutton.org/2.2/dev.html#setup-a-development-environment.

Make a folder and run the following code to clone the official repo:
``` bash
git clone https://github.com/bigbluebutton/bigbluebutton.git
```
Install dependencies:
``` bash
sudo apt-get install git-core ant ant-contrib openjdk-8-jdk-headless
```
Add JAVA_HOME to environment variables:
``` bash
vi ~/.profile
```
Append the following code to `~/.profile`
``` bash
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```
Then, update environment variables:
```
source ~/.profile
```
Install more sdk tools:
``` bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

sdk install gradle 5.5.1
sdk install grails 3.3.9
sdk install sbt 1.2.8
sdk install maven 3.5.0
```

#### change nginx configurations

*In the following instructions, replace the following path with the path you clone the official repo.*
``` bash
/home/ubuntu/dev/bigbluebutton
```

First, check the nginx configuration.
``` bash
cd /etc/bigbluebutton/nginx/
ls -lt
```
You should see that `web.nginx -> /etc/bigbluebutton/nginx/web`, `client.nginx -> /etc/bigbluebutton/nginx/client`. Run the following code:
``` bash
sudo cp web web_dev
sudo cp client client_dev
sudo rm web.nginx client.nginx
sudo ln -s web_dev web.nginx
sudo ln -s client_dev client.nginx
```

Modify client_dev by replacing every `/var/www/bigbluebutton` with `/home/ubuntu/dev/bigbluebutton`.

#### HTML5 development environment

Since we focus on developing the front end, we only need to focus on developing html5 features.

Install meteor.js
``` bash
cd ~/dev/bigbluebutton/bigbluebutton-html5
curl https://install.meteor.com/ | sh
meteor update --allow-superuser --release 1.9
```

There is one change required to settings.yml to get webcam and screenshare working in the client (assuming you’re using HTTPS already). The first step is to find the value for `kurento.wsUrl` packaged `settings.yml`.

``` bash
grep "wsUrl" /usr/share/meteor/bundle/programs/server/assets/app/config/settings.yml
```

Next, edit the development `settings.yml` and change wsUrl to match what was retrieved before.

``` bash
vi private/config/settings.yml
```

You’re now ready to run the HTML5 code. First shut down the packaged version of the HTML5 client so you are not running two copies in parallel.

``` bash
sudo systemctl stop bbb-html5
```

Install the npm dependencies.

``` bash
meteor npm install
```

Finally, run the HTML5 code.

``` bash
npm start
```

Then the development environment is set up.

### Pull collaborative repo

Since the official repo is too large, and we only need to develop client in bigbluebutton-html5 folder, I set up a subset (bigbluebutton-html5 folder) of the origin repo at https://github.com/KiaLAN/bbb-html5-client, which contains the modification we've made.

``` bash
cd /home/ubuntu/dev/bigbluebutton/bigbluebutton-html5
git init
git remote add origin git@github.com:KiaLAN/bbb-html5-client.git
git pull origin master
```

## install docker version

Before using any of the instructions, one should check Docker Preference settings.

For Docker Desktop systems, one must go into Docker Preference -> Resources and set Memory to 4Gb.  

### Pull image from online repository

~~~shellmeteor update --allow-superuser --release 1.8
$ docker login
$ docker pull bigbluebutton/bigbluebutton:latest
~~~
from https://hub.docker.com/r/bigbluebutton/bigbluebutton



### Start bbb after having the image
~~~shell
$docker run --rm -p 80:80/tcp -p 1935:1935 -p 3478:3478 -p 3478:3478/udp <IMAGE_ID> -h <HOST_IP>
~~~
Now the docker container is built and we can login locally in 127.0.0.1:80. To configure bbb in the docker, use
~~~shell
$ docker ps
~~~
to get the container's id, and use
~~~shell
$ docker exec -it <container_id> /bin/bash 
~~~
to attach into the docker.




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



