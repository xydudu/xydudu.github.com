---

title: 体验meteor
date: 2012-05-27
layout: default

---

### What?
先很简单的介绍下meteor，它的官网是：[meteor.com](http://meteor.com)，官方的介绍是：

> Meteor is a set of new technologies for building top-quality web apps in a fraction of the time, whether you're an expert developer or just getting started.
	
翻译成中文大概就是：Meteor 是一套让用户在短时间内搭建一个高质量网页应用的新技术，面向的用户不仅是专业的开发者，还包括刚入门者。

它不是一种新语言，它应该算是一种开发框架，当然这和我们前端传统认识的框架是不同的两个概念。这是整个开发流程与方法的定义，一种新的开发模式。

### Features
其官网上列了9个特点，就不一一复制了，我个人较喜欢的几个特点是：

* Pure Javscript 这个不必多说，做为一个前端，这就是Meteor直接吸引我的主因
* Live page updates 开发时的页面自动更新，这对开发效率是很有帮助的
* Clean, powerful data synchronization 强大的数据同步能力，(这个有人喷会有安全问题，但是不否认这个让我在开发时体验非常棒)

其它的一些特点就不多说的.

### hello world
照例，先来一个hello world，看看Meteor是如何构建应用的，当然也看它是否真的是很方便的短时间内就能构建完成。

如果你的机器上还没有安装过Meteor，当然你得先把Meteor环境安装到你的机器上，这是很简单的一件事，打开终端，输入如下命令执行即可：
	
	$ curl install.meteor.com | sh

当然，meteor是依赖于nodejs的，所以，你得先确保机器上已有nodejs环境。

安装好后，要创建一个简单的hello world实在是太简单了，因为你执行：
	
	$ meteor create helloworld

创建一个新项目，meteor会新建一个名为helloworld的目录，里面包括了三个文件:

	➜  helloworld  tree
	.
	├── helloword.css
	├── helloword.html
	└── helloword.js

你在此文件夹中启动 meteor 服务，在浏览器中访问： localhost:3000 就能看到helloworld已经成功运行了。

这样可能会让不了解的人有些迷惑，所以，我把helloworld文件夹清空，我们从零开始来创建一个helloworld.

#### Html
进入到helloworld文件夹，新建一个html文件: index.html。编辑 index.html:

{% highlight html linenos %}

<title>Hello World</title>
<body>Hello World</body>

{% endhighlight %}

启动：meteor，在浏览器就能看到效果了。

#### Css
接着上面的，再新建一个 style.css 的文件，我们加点样式看看，注意你的浏览器变化：

{% highlight css linenos %}	
body {
    color： red;
}
{% endhighlight %}

可以看到，当你保存style.css后，浏览器立即就做出了相应反应，这种实时反应开发结果的开发模式显然是很能提高开发效率的，这不是meteor首创，有很多类似的库与工具都能实现相似的效果，但是meteor是集体到自身内部的，你完全无需去特别的配置，非常的简单，对于初学者来讲是很是友好。

#### Template
meteor 提供了一种非常方便的模板机制，让我们开发起来非常的舒服，比如上面的例子，我们再扩展开来，编辑index.html:

{% highlight html linenos %}
<head>…</head>
<body>
	<h1>Hello World</h1>
	{{> hello }}
</body>
<template name="hello">
	<p>This is from template</p>
</template>
{% endhighlight %}

当然，meteor也可以很方便的从javascript文件中定义变量，下面我们新建一个javascript文件 app.js，并写入：

{% highlight javascript linenos %}

if (this.Template) 
    Template.hello.who = function() {
        return 'Lian Hsueh'; 
    };

{% endhighlight %}

然后在html中通过 {{变量名}} 来访问javascript文件定义的变量值。如：

{% highlight html linenos %}
<template name="hello">
    <p>This is from template, and I am {{ who }}</p>
</template>
{% endhighlight %}

meteor的模板系统是非常强大的，后面在实例中可以慢慢体会。

#### 后端？
讲了这么多，好像一直是停留在浏览器端，难道就这么简单么？显然不是的，meteor是支持后端的，用的是nodejs，语言就是javascript。那如何开始编写后端程序呢？其实上面的代码中有一部分已要是在后端也运行着，就是 app.js。

我们可以做个简单的测试来验证一下，编辑app.js，加入一行：
	
{% highlight javascript linenos %}

	console.log('Hey, can you see me?');
    
{% endhighlight %}

保存后查看终端与浏览器console，都能见到输出，证明 app.js 文件是同时运行在浏览器与服务端。

这就有疑问了，如果有的对象只能浏览器访问，有的则只能服务端访问，这怎么办？

meteor很好的解决了这个问题，简单的应用中，比如我们这个helloworld程序，只是包括很小部分的代码，你可以直接在 app.js 中通过 Meteor.is_client 与 Meteor.is_server 来限定哪些在浏览器中执行，哪些只在服务端中执行，如上面的给模板设定变量的语句，只需要在浏览器端执行，则可以这样写：

{% highlight javascript linenos %}

	if (Meteor.is_client) {
		Template.hello.who = function() {
			return 'Lian Hsueh';
		};
	}

{% endhighlight %}

而像一些可以同时应用于前后端的脚本，你就不需要做特别的处理了，一份代码服务于前后端，比之前后端分离肯定是要高效很多。比如一个表单的验证脚本，通常你要前端一个检测的脚本，后端也要维护一份相同功能的代码，而此时我们只需要维护一份代码就好。

### 实例讲解	
helloworld实在是太过简单了，完全不能领略meteor的强大，下面来完全一个完整的应用，看看meteor在实际使用中的表现。


	
