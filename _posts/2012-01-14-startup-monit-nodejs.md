---
layout: default
title: Startup + Monit 保障nodejst稳定运行
---
一直以来，我都只是个在浏览器中折腾代码的前端，对于服务器一直存在着畏惧，随着nodejs越发流行，凭着这样一个媒介，我慢慢试着去了解一下服务器，收获且不小。

一般nodejs的教程中并没有较详细的涉及到生产环境的布署，特别是服务，进程如何维护与监控。这也在很长一段时间困绕着我。试过forever，但是不少的bug，这显然不是一个成熟的方案。

之前有配置过python的生产环境，用到的是Supervisor，我想也是可以用在node上的，但是我想应该还有别的方案吧，都了解一下又何妨？

寻觅后，看了如下两篇文章：

- [Run Node.js as a Service on Ubuntu](http://kevin.vanzonneveld.net/techblog/article/run_nodejs_as_a_service_on_ubuntu_karmic/)
- [Deploying Node.js With Upstart and Monit](http://howtonode.org/deploying-node-upstart-monit)

尝试过后，原来很是简单，且做记录。

###配置Upstart，让你的nodejs应用像系统服务一样便于启动，重启和停止

upstart一般在ubuntu下是已经安装好了（如在其它linux版本，可到其官网去了解如何安装），所以下面要做的其实非常简单，新增一个对应你的nodejs应用的配置文件便可，一般来说配置文件存放在“/etc/init/”下。

给应用想一个名字，假定这里是：node-hello
新增一个 node-hello.conf 文件到 /etc/init/ 文件夹下，注意这里是要 root 权限的，sudo吧。
添加如下内容至文件：

	description "node.js hello world"
	author "xydudu http://xydudu.com"
	
	#这里是什么时候自动启动与关闭
	start on started mountall
	stop on suhtdown
	
	#设置服务异常停止后重启次数及间隔时间
	respawn
	respawn limit 99 5


	script

    	export HOME="/home/xue"
    	#执行命令
    	exec /usr/local/bin/node /home/xue/www/node/helloworld.js >> /var/log/node-hellowo rld.log 2>&1

	end script

当配置文件保存好后，执行：

	$ initctl list | grep node

应该能看到如下输出：

	node-hello stop/waiting

嗯，还得记得把供执行的nodejs文件chmod成可执行：

	$ chmod u+x /your/nodejs/file

现在你可以：
	
	sudo start node-hello #启动服务
	sudo restart node-hello #重启
	sudo stop node-hello #停止 

关于Upstart部分，基本差不多了，更多的配置可参考：
>http://upstart.ubuntu.com/cookbook/


