---
layout: default
title: 基于backbone构建应用
---

## 引言
时代前进，网速变快，硬件升级，互联网调整发展。web端的应用越发精彩，而前端的作用也显得似乎要比原来要大了。这里对什么是前端，前端工程师的职责，并不过多叙述。最近我在玩Backbone，觉得非常有意思，希望把这种感觉传递，苦逼的前端是很需要一些好玩的东西来刺激一下，才不会逼到搞基。

关于Backbone,简单来说是一个前端MVC的框架，当然它并不是严格意义上的Model, View, Controller。随着实例的讲解，其基本结构待我一一道来。

## 实例intro
太复杂的应用我短时间内也做不完，能力有限。来个简单的例子，就写一个照片墙的例子罢。现在不是流行瀑布流么？就简单的来一个。当然，这个例子并不纠结于表现形式，一切外在都是浮云，我向来是对CSS木感觉的，就像面对一个女人，你想看的也不会是外面光鲜的衣物。

### 用到的
后端将用node支撑，这次的主角是Backbone,所以后端如何实现具体不多做介绍。

下面是例子用到的一些开源库：

* jQuery
* Backbone
* Underscore
* Isotope [https://github.com/desandro/isotope]
* Honey

### Hello World
我最喜欢就是hello world了，一般开始前，我都要这么闹一翻。其实Backbone的hello World非常简单，比如，我只要一个view就可以了：

	:::javascript -
	var app = Backbone.View.extend({
		tagName: 'h3',
		render: function() {
			this.$el.html( 'Hello World' );
			return this;
		}
	});	
	
	//调用
	$( 'body' ).append( new app().render().el );

这里简单的说一下我是如何理解Backbone的view。其实可以把它看成是一个 Element 对象，可以方便的定义其属性（如：可定义其 tagName, className…），与添加对其自身作用的方法（如：render()）。而且，还能很方便的绑定事件到元素与其子元素，如将上面的代码改一改：
	
	:::javascript -
	var app = Backbone.View.extend({
		tagName: 'h3',
		events: {
			'click': 'showWorld'
		},
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html( 'Hello' );
			return this;
		},
		showWorld: function() {
			this.$el.append( ' World' );
			return this;
		}
	});	
	
	//调用
	$( 'body' ).append( new app().el );
	
这其实是很简单的示例，下面我们正式进入例子的编码罢。

### 定义Router(Controller)

这个简单的例子只有两个页面，所以，Router简单定义如下：
	
	:::javascript -
	var app = Backbone.Router.extend({
        routes: {
            "/view/:pid": "view",
            "*actions": "list"
        },
        initialize: function() {
            console.log( 'app inited' ); 

        },

        list: function() {
            console.log( 'list' );
        },

        view: function( pid ) {
            console.log( 'view pic '+ pid );
        }
    });
	
	//调用
	new app();
	//监控 hash tag 变化
	Backbone.History.start();

**routers** 定义了两个URL，对应下面要触的事情，代码整个看起来应该是非常明了的。可以看到它是支持通配符的，参数也很方便的可以传递给触发的函数中。

最后一句的**Backbone.History.start()**是Backbone用来监视url变化的，且让浏览器的后退前进按钮可以作用，让应用的体验与普通的链接切换是一样的。如果你不喜欢像 **#/view/1** 这样的夹着一个 **#** ，而且你的应用是支持HTML5的，那么恭喜你，你可以在调用的时候给start加上{pushstate:true}的参数，这样Backbone.History就帮你自动的切换成了与普通链接无异的URL。当然，这样的话，事情的调用也是有少许变化的，这点暂不在此议。

上面的代码其实就是我要讲的简单例子的**Controller**了，很是粗糙，但是却管用，下面我们来把list函数完成。

### 照片列表展示

上面一节中，我定义了一个**Router**，对应显示列表页的函数是 **list**，主要的功能就是从后端接口取得数据，并渲染照片列表。对于列表**Backbone**对应的**Backbone.Collection**，当然，明确的是，这只是处理纯数据的，与HTML有关的应该全部交给**Backbone.View**去处理。这里的**Backbone.Collection**与还未提到的**Backbone.Model**构成**MVC**中的**M**。

我先做好了一个后端的接口 **/api/list** , 其返回是：
	
	:::javascript -
	[
		{
			"id": "1",
			"src": "photo path",
			"intro": "photo description"
		},
		{
			"id": "1",
			"src": "photo path",
			"intro": "photo description"
		},
		...
	]

从数据上来看，这样的一个json数组对应的便是 **Collection**，而里面的个体对象，对应 **Model**。接下来要写 的代码就是把这些数据对象化，变成方便我们操作的对象。
	
	:::javascript -
	var Model = Backbone.Model.extend({
        initialize: function() {
            console.log( 'model OK' );
        }
    });

    var Collection = Backbone.Collection.extend({
        initialize: function() {
            console.log( 'Collection OK' );
        },
        model: Model,
        url: '/api/list'
    });
	
	//调用
	var list = new Collection();
	list.fetch(); //通过定义的URL取得数据
	
**fetch** 方法执行后便会自动的调用ajax请求，取得调用定义url的数据，并实例化为一个Collection对象，与对应数量的Model对象。下面我们结合View对象，来把数据渲染为页面。可以一个Model对应一个View，也可以一个Collection对应一个View，这里我将定义两个View，分别渲染个体图片与图片集合。代码如下：
	
	:::javascipt -
	var ItemView = Backbone.View.extend({
        tagName: 'li',
        render: function() {
            this.$el.html( this.model.get('src') );
            return this;
        }
    });

    var CollectionView = Backbone.View.extend({
        el: $( '#container' ),
        renderItem: function( $model ) {
            var itemview = new ItemView({
                model: $model
            }); 
            this.$el.append( itemview.render().el );
        },
        render: function() {
            this.collection.each( this.renderItem, this );
            return this;
        }
    });
    
    //在router的list中调用以渲染页面
    list: function() {
    	var collection = new Collection();
        var listview = new CollectionView({
        	collection: collection
        }); 
        collection.fetch();
        collection.on( 'reset', listview.render, listview );
    }
    
现在的代码已经能够把数据反应到页面上了，只是这显示不能当做是一个网页，要想办法把数据按自己的想法显示，这时候需要模板了，Backbone支持几乎所有的前端javascript模板引擎，但其实其依赖的**Underscore**就有了一个够用的模板引擎了，所以这里直接用Underscore自带的**_.template**来组合模板与数据。通常模板可以写到JS文件中，也可以写到HTML页面中，各有各的好处吧，如果有很多地方要用相同的模板，比较好的做法是独立一个template.js来放模板，便于在各处使用以及压缩缓存。但是此处的例子模板都是仅在当前页使用的，所以我把模板写到页面中：
	
	:::javascript -
	script( id="tmpl-item", type="text/template")
        | <div>
        | <a href="#/view/<%= id %>" >
        |   <img src="<%= src %>"  />
        | </a>
        | </div>
        | <p><%= intro %></p>

模板写到页面中，其实就是放进一个容器中，当然，你得保证此容器是不可见的，要不模板直接显示在页面中肯定是不行的。我选择的是放在一个type为 **text/template** 的script容器中。

刷新页面，数据与模板已经能正确的显示出来了，我们简单的照片墙已经实现了，接下来，处理用户的点击行为，用户点击照片后，进入到view大图的模式。之前定义的Router会监测URL的变化，所以这里并不需要添加另外的事件来触发，我们只需要如传统的链接般，给列表图片添加一个链接到 #/view/:id ，然后Router会触发相应的view方法。可以看到我们的代码都已经实现了，现在需要做的就是把view写完。

### 大图

相比于List显示很多张图片，这里的View大图，就是一张图片，当然图片地址要换，一个是小图，一个是大图。之前的代码中已经有了一个item的Model与View，显然，此时的单张大图浏览可以继续使用。

小小修改一下Model与ItemView两个对象，以使其能两个页面共同，后端已经准备好了接口 "/api/view/:id" 来取得单张图片的详细信息，给 Model 添加 urlRoot，Backbone.Model会以其id与urlRoot自动组合成该Model对应的后端接口。于是 Model 的代码变成了如下：
	
	:::javascript -
	var Model = Backbone.Model.extend({
        initialize: function() {
            console.log( 'model OK' );
        },
        urlRoot: "/api/view"
    });

然后在Router的view方法中调用：
	
	:::javascript -
	view: function( pid ) {
	    var model = new Model({ id: pid });
        model.on( 'change', function() {
        	var view = new ItemView({
            	model: this,
                el: $( '#container' )
            }); 
            view.render();
        }, model );
        model.fetch();
    }
   
这段代码其实与调用Collection时是非常相似的fetch()用来从后端相应API取得数据，然后交给View来渲染页面。这段代码现在已经能顺利的跑通了，加点CSS，最后呈现出来的就是一个简单的单页照片墙应用了。

![photo-wall](http://dl.dropbox.com/u/5900533/images/photo-wall-shot.png)

### 优化

上面的代码跑起来是没问题的，但是图片众多，切换起来是否有些突兀，最好加个loading状态过度一下，通过实现此功能，来了解一下Backbone **event**的handle, fire。

loading状态是在图片未加载好之前显示，图片加载完成后，则要相办法通知到控制loading消失的方法。 图片对应的都是Model，要知道图片是否加载完，我们改造一下Model:
	
	:::javascript -
	var Model = Backbone.Model.extend({
        initialize: function() {
            this.loadImg(); 
            this.on( 'change', this.loadImg, this );
        },
        loadImg: function() {
            if ( !this.get( 'src' ) ) return;
            var 
            that = this,
            img = new Image();
            img.onload = function() {
                that.trigger( 'loaded' );
            }
            img.onerror = function() {
                that.trigger( 'imgerr' );
            }
            img.src = this.get( 'src' );
        },
        urlRoot: "/api/view"
    });

添加一个loadImg的方法，判断是否该Model的图片加载完成，如加载完成，则触发一个**loaded**事件。Backbone对象都有一个事件的绑定与触发机制，规则如下:
	
	:::javascript -
	// 绑定一个方法到对象某自定义的事件上
	Object.on( 'event', callback, [context] );
	
	//触发绑在对象某事件上的所有方法，第二个参数会当做参数传入callback中
	Object.trigger( 'event', [*args])

接下来只要在图片Model示触发 loaded 之前显示 loading 状态，触发之后，关闭 loading 状态，显示相应内容即可。

## 后记

这次实现的只是一个非常简单的例子，很多东西并不是讲的非常详细。前端的MVC架构其实并不适合平常的一些web项目，但是这必定是一个前端繁荣发展的征兆，做为一句前端，或者说程序员，接受新的信息与思想是很重要的，搞互联网，守旧应该是会很悲剧的。


本文的代码都在github:[https://github.com/xydudu/photo-wall](https://github.com/xydudu/photo-wall)





	







	
