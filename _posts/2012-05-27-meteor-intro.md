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

* Pure Javascript 这个不必多说，做为一个前端，这就是Meteor直接吸引我的主因
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

{% highlight template linenos %}
<head>…</head>
<body>
	<h1>Hello World</h1>
	\{\{> hello \}\}
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

    <template name="hello">
        <p>This is from template, and I am {{ who }}</p>
    </template>

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

#### 数据
一个完整的应用，必然要与数据打交道的，Meteor的数据通讯很棒，它操作数据也是异常的方便，如果使用过一些其它语言的ORM实现，应该能很好的去理解。

下面给helloworld添加点代码，用来显示从数据库中取得到一个列表，修改 app.js，添加：

{% highlight javascript linenos %}
var NameList = new Meteor.Collection('namelist');
if (Meteor.is_client) {
	Template.hello.namelist = function() {
		return NameList.find({});
	};
}
{% endhighlight %}

然后修改 index.html：

    <template name="hello">
        <p>This is from template, and I am {{ who }}</p>
        <ul>
            {{#each namelist}}
            <li>{{ username }}</li>
            {{/each}}
        </ul>
    </template>

数据库、表，这些都是直接与你代码collection对应，你完全不需要去在意，在意你的代码就行了。

此时数据库还没有数据，页面中也不会显示什么，要添加数据很简单，你可以直接在浏览器console中执行 

	Namelist.insert({username: 'xyududu'});

来添加一些数据，相应的也有remove与update方法。meteor较神奇的是，你对无论你在何地对数据库的操作都将实时的反应在页面中，所以你可以很方便的在开发时利用浏览器console来测试你的应用。

### 实例讲解	
helloworld实在是太过简单了，完全不能领略meteor的强大，下面来完全一个完整的应用，看看meteor在实际使用中的表现。

从实例着手，一般就是做个blog了，恰巧w3ctech长沙站的各位哥也要求有这么一个blog来分享聚合一些技术文章。索性，就开始写这么一个blog程序，并让其可在实际中应用。

源码可到[github](https://github.com/xydudu/a-meteor-blog)获取，这里只提几个要点。

#### 文件结构
要做一个较正式的应用，文件显然不能乱放，特别是我们前端，涉及众多javascrpt、css、images等等，如果随意摆放越往后就越头痛。我这里简单规划的一个文件结构如下：

	➜  w3ctech  tree
	.
	├── client //文件夹，浏览器端使用
	├── server //文件夹，服务端使用
	└── static //文件夹，主要存放图片

#### 数据结构
简单点搞，先就一个文章的数据表结构如下：
	
	Article -- {
		title: String,
		author: String,
		content: String,
		tags: [String, …],
		createtime: Number
	}


#### 与Backbone结合
做web application，选一个好的前端MVC框架，会带来很多便利，显然 Meteor 与 Backbone 的结合是非常的理所应当。Meteor的官方也把 Backbone 做为一个内置 package。可以在命令行中很方便的给你的应用添加 backbone 支持:

	$ meteor add backbone

另外我写css一般都用less，所以顺便我也把 less 引入进来：
	
	$ meteor add less

meteor 现在可用命令添加的 package 有蛮多了，可至其官网查询。

好，继续说 Backbone， 先看下面代码：

{% highlight javascript linenos %}
var Blog = Backbone.Router.extend({
    routes: {
        "admin": "backend",
        ":article_id": "showArticle",
        "": 'index'
    },
    index: function() {
        Session.set("article_id", null);
        Session.set("backend", null);
    },
    backend: function() {
		if ($.cookie('admin')) {
            Session.set("backend", 'post');
        } else {
            Session.set("backend", 'login');
        }
    },
    showArticle: function ( _id ) {
        Session.set("article_id", _id);
        Session.set("backend", null);
    },
    changeTo: function( _id ) {
        this.navigate(_id, true);
    }
    
});

Router = new Blog();
Meteor.startup(function () {
	Backbone.history.start({pushState: true});
});
{% endhighlight %}
 
如果你之前用 Backbone 写过应用之类的，应该能很快理解上面的代码，开启一个全局路由，捕获 url 的变化而执行相应的方法。这样就很方便的控制应用的显示，从而模拟出传统页面的切换。

#### 内容的展示
Meteor 负责页面渲染主要是通过模板，可以说你了解了如何控制模板，你就能用 Meteor 写出牛B的应用。其实基本上所有的富前端应用都是非常的倚重模板的。

Meteor 的模板上面的提过一个是  Template，还有一个是 Meteor.ui，这两个都是负责把数据组合到模板并渲染到页面。我此次的 demo 大量的使用了 Template。

拿列表页来说，主要功能就是把文章的标题与时间以列表的形式显示在页面中。查看其模板代码:

    <template name="list">
    <ul>
        {{#each list}} 
        <li>
        <time datetime="{{createtime}}">{{ formarttime }}</time>
        <a 
            id="{{ _id }}"
            href="/{{ _id }}">{{ title }}</a></li>
        {{/each}} 
    </ul>
    </template>

然后在javascrpt文件中可以直接以 Template.list 来操作这块模板。比如这个例子中：

{% highlight javascript linenos %}
var listTpl = Template.list;
listTpl.list = function() {
    return Article.find({});
};
listTpl.formarttime = function() {
    return moment( this.createtime ).fromNow();
}
listTpl.events = {
    'click li>a': function( _e ) {
        var key = _e.target.id;
        Router.changeTo( key );
        return false;
    }
};
{% endhighlight %}

指定 list 数据，还有一个 formarttime 是格式化时间，在模板中可以直接以 {{ formarttime }} 来调用。

#### events
你的应用要与用户交互，必然就离不开事件，根据用户的操作而触发不同的事件来响应用户。 Meteor 的事件在模板中可以很方便的绑定，其实本质上应该是一个总的委托在模板上的事件。这种处理方式现在应该很常见了，比如 jquery 的 delegate()， Backbone 模板的事件处理也是类似的。

Meteor的事件可以直接绑在 Template 对象的 events 属性上。如上面的：

{% highlight javascript linenos %}
listTpl.events = {
    'click li>a': function( _e ) {
        var key = _e.target.id;
        Router.changeTo( key );
        return false;
    }
};
{% endhighlight %}


#### deploy or host yourself

应用写完了，如果你打算把服务托管到 meteor 上，那就非常方便，你可以直接命令行：

$ meteor deploy yourappname.meteor.com

上传完成后，你就可以直接以：yourappname.meteor.com 来访问你的应用了。

而且很舒服的一点是，你不需要去管你的javascript文件与css文件是否合并，是否压缩，因为这些都是 meteor 会自动完成的。

当然你可以把应用托管在你自己的服务器中，你可以用 meteor bundle 来进行代码打包，然后就可以方便的上传到你自己的服务器了。

### PPT
<div class="prezi-player"><style type="text/css" media="screen">.prezi-player { width: 650px; } .prezi-player-links { text-align: center; }</style><object id="prezi_ao57nxmdxlfc" name="prezi_ao57nxmdxlfc" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="550" height="400"><param name="movie" value="http://prezi.com/bin/preziloader.swf"/><param name="allowfullscreen" value="true"/><param name="allowscriptaccess" value="always"/><param name="bgcolor" value="#ffffff"/><param name="flashvars" value="prezi_id=ao57nxmdxlfc&amp;lock_to_path=0&amp;color=ffffff&amp;autoplay=no&amp;autohide_ctrls=0"/><embed id="preziEmbed_ao57nxmdxlfc" name="preziEmbed_ao57nxmdxlfc" src="http://prezi.com/bin/preziloader.swf" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="550" height="400" bgcolor="#ffffff" flashvars="prezi_id=ao57nxmdxlfc&amp;lock_to_path=0&amp;color=ffffff&amp;autoplay=no&amp;autohide_ctrls=0"></embed></object><div class="prezi-player-links"><p><a title="Meteor Intro" href="http://prezi.com/ao57nxmdxlfc/meteor-intro/">Meteor Intro</a> on <a href="http://prezi.com">Prezi</a></p></div></div>
