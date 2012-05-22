---
layout: default
title: 搭建git服务器及利用git hook自动布署代码
----

我喜欢 [githbu](http://github.com)，我现在的个人代码全部是托管在上面了，但是一些公司或者某些项目不适合放入github中，你希望能有一个完全私有的仓库，如果你有一台服务器，这显然是很容易办到的事。

下面简单的描述我在某个项目中布署的一个git服务，并且本地提交更新后，服务器将自动更新代码到在线代码的仓库。

### 创建用户并使客户机可通过密钥登录服务器

#### 服务器中操作：
- root 用户ssh登录服务器，创建一个新用户用来给git登录及其操作，比如这里我创建一个名为“git”的用户：
    
        $ sudo add user git
	
- 进入到 /home/git 文件夹中，查看是否有 .ssh/ 目录， 如没有：
		
		$ mkdir .ssh

- 进入 /home/git/.ssh 文件夹中，创建文件 authorized_keys

- 等待

#### 客户机中操作：
- 进入 ~/.ssh/ 目录，查看是否有 id_rsa.pub 文件，如没有：
		
		$ ssh-keygen

- 一路回车，完成后，便可发现 ~/.ssh/ 目录中有 id_rsa.pub， 复制其内容，粘贴到上面操作服务器的 authorized_keys 文件中
- 测试是否密钥登录成功
	
		$ ssh git@yourserverip
	 
### 创建git服务器远程仓库
- 进入 /opt/git 目录， 如没有，创建之
- 建立仓库文件夹，比如：
		
		# path: /opt/git
		$ mkdir gitdemo

- 初始化为远程仓库
		
		$ git init --bare

上面的步骤已经完成了git远程仓库的创建，此时你只要将你本地的git代码仓库 git remote add git@yourserverip:/opt/git/gitdemo，便可提交与更新代码了。

比如我机器上的开发目录为：~/www/gitdemodev， 进行下面操作：
	
		$ cd ~/www/gitdemodev
		$ git init
		#建一个文件，写点东西进去
		$ touch README | echo 'hello git' > READEME 
		$ git add README
		$ git remote add origin git@yourserverip:/opt/git/gitdemo
		$ git commit -m 'first commit'
		$ git push origin master
		
现在你已经本地的代码成功的提交到了远程仓库中，只需在你团队成员电脑上作相同操作，便可利用git协同开发了，注意把各自电脑的 id_rsa.pub 内容复制进服务器的 authorized_keys 文件中。

### git hook 自动布署代码
假设你的项目也是跑在此台服务器上，那自动布署代码就很简单了，比如你的在线服务代码在 /var/www/demo 文件夹中。

你先初始化代码库：
		
		$ git clone /opt/git/gitdemo /var/www/demo

然后你可以通过 git pull 来更新代码。

当然这样是手动了，我想要的是本地提交更新后，服务器能自动的 git pull代码到最新，于是我们就要借助 git hook了。

进入到 /opt/git/gitdemo 文件夹中，会发现 .git/hook 文件夹在里面，进入到 hook 中，里面有很多的 sample 脚本，这里我们只需要用到 post-update。 

		$ mv post-update.sample post-update
		$ vim post-update

可以看到里面其实就是一些shell脚本，你要做的就是把 git pull写进去。当用户提交后，便会调用post-update脚本的。

这些脚本显然是可以做很多事的，只要你想得到，要了解各脚本何时调用，google吧。

【注】服务器中与git用户有关的文件夹及文件，请：
		
		$ chown -Rh git:git /your/git/dirs 
				
