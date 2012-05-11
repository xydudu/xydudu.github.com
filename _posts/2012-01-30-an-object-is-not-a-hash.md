---

date: 2012-1-31
title: [My read note] An Object is not a Hash
layout: default

---

Following my article "A String is not an Error", I want to bring attention to an issue that similarly applies *( 适用于 )* to Javascript in general, but has special relevance *( 相关 )* in the Node.JS environment.

###### 从我的上个文章开始，我想把关注点放在一些适用于传统的Javascript，但是在Node.JS的环境中有些特别的课题中。

The problem boils down*( 归结 )* to the usage "{}" as a data-structure*( 数据结构 )* where the keys are supplied*( 提供 )* by untrusted*( 不可信 )* user input, and the mechanisms*( 机制 )* that are normally used to assert*( 断言 )* whether a key exists.

###### 问题在于使用 "{}" 的数据结构时，其key的值是用户来指定的，有不确定性，还有如何有效的判断key是否已经存在。

Consider*( 考虑 )* the example of a simple blog created with Express. We decide to store blog posts in memory in a "{}", indexed by the blog post slug*( 弹头,这里应该是指能标记文章的一个东西 )*. For example, this blog post would be:

###### 以一个用express为基础的简单blog系统做例子，其文章是存在一个{}数据结构中，以文章的slug来做索引，文章数据如下：

	posts[ 'an-object-is-not-a-hash' ]

We start writing the route "/create", which takes a few POST fields like "title" and "slug" and passes it to a Post constructor.

当写一个方法来生成文章时，表单里有一些字体如 "title", "slug"，传给一个 "Post" 的类来保存。

	var posts = {};
	app.post( '/create', function( req, res ) {
	    if ( req.body.title && req.body.slug ) {
	    	// avoid duplicates( 重复 )
	        if ( !posts[ req.body.slug ] ) {
	        	posts[ req.body.slug ] = new Post( req.body );
	        	res.send( 200 );
	       	} else {
	            res.send( 500 );     
	        }
	} );

Our first stab*( 刺 )* for trying to avoid duplicates*( 重复 )* is checking whether the key exists in our object.

###### 我们碰上的第一个坎是通过判断key是否存在于文章object中来防止重复保存一个文章。

	if ( !posts[ req.body.slug ] ) {

Normally this would work fine, but let's consider that the user could pick any of the keys that are *present( 目前 )* in any Javascript object as a name.

###### 通常这样判断是没有问题的，但是考虑到用户可以选择任何值来作为key，甚至包括当前已在存在于javascript对象中的key值.
	
	__defineGetter__, 
	__defineSetter__, 
	__lookupGetter__, 
	__lookupSetter__construcor, 
	hasOwnProperty, 
	isPrototypeOf, 
	propertyIsEnumerabletoLocaleString, 
	toString, 
	valueOf

If the user wanted to, for example, name his blog post "constructor" our program would behave( 表现 ) incorrectly( 不正确 ). We therefore( 因此 ) change our code to leverage( 利用 ) "hasOwnProperty", which will allows to check whether the property has been set by us:

###### 比如，用户写了一个文章名字为“constructor”，此时执行上面的代码将出错。因此，修改上面的代码，利用“hasOwnProperty”方法来判断值是否已经被设定。

	if ( !posts.hasOwnProperty( req.body.slug ) ) {    
		posts[ req.body.slug ] = new Post( req.body );     
		res.send( 200 );
	}

Most Javascript programers are already familiar with "hasOwnProperty", since in the browser world it's the standard( 标准 ) way of writing libraries that work well in environments where "Object.prototype" is modified, so this addition should come to most as no surprise.

###### 从写一些库来处理修改的"Object.prototypes"，并成为了浏览器环境的一个标准处理方法后，大多数的javascript程序员已经对“hasOwnProperty”很熟悉了。所以这个解决办法能在绝大部分的情况下表现良好。

###The hasOwnProperty trap( 陷阱 )

Our program, however, is still susceptible( 容易受影响 ) to potential( 潜在 ) misbehaving. Let's say our user decides to call his blog post "hasOwnProperty". The first time our check executes, everything will behave correctly, since the check will return false:

###### 上面的代码，却仍然有潜在的问题。当用户决定把文章名定为 “hasOwnProperty” 时，第一次执行上面代码，一切正常，检查代码会返回false。

	~ node> var a = {};> a.hasOwnProperty( 'hasOwnproperty' )false

Our code would therefore set the "hasOwnProperty" value in our object to the "Post" instance, which is an object. We can now simulate( 模拟 ) what would happen if the user tries that again:

###### 因此上面的代码会给数据对象设定一个键为“hasOwnProperty”值为“Post”实例对象的条目，现在我们可以模拟一下如果我们再一次执行上面的检查会出现什么情况。
	
	> a.hasOwnProperty = {}{}
	> a.hasOwnProperty( 'hasOwnProperty' )
		TypeError: Property 'hasOwnProperty' of object #<Object> is not a functionat [object Context]:1:3


As a result:

- Our code would throw a ( potentially( 潜在 ) ) uncaught exception.
- Execution of our "/create" route would be aborted and response would not be sent to the user.
- The request would be left hanging until it times out on both ends.

###### 结果：抛出异常；“/create”执行被中止，返回不会发送给用户；请求被挂起，直到超时。 

The solution to this problem is to avoid relying( 依托 ) on the "hasOwnProperty" provided by the object we are dealing with, and use the generic( 通用 ) one from the "Object.prototype". If we execute it on our test subject, "true" will be returned after we set it as expected( 预计 ):

###### 解决这个问题在于要避免依托于我们正在处理对象提供的方法如：“hasOwnProperty”来用于判断，而应该利用通用的Object提供的方法。
	
	> Object.prototype.hasOwnProperty.call( a, 'hasOwnProperty' )true

###Conclusions

The first conclusion from this experiment( 实验 ) is that from the moment we decide to use a Javscript object as a general-purpose hash table we can no longer rely on any of its inherited( 继承 ) properties, specially "hasOwnProperty" ( which we are normally bound( 界 ) to use ). This oversight( 小错 ) as a matter of fact, afflicted( 折磨 ) the Node.JS core [querystring library](https://github.com/joyent/node/issues/1707) in the past.

###### 这人实验第一个结论，当我们决定使用一个javascrpt对象数据结构时就不能够依靠继承过来的方法与属性，特别是"hasOwnProperty"，这个小过失实际上一直在折磨着Node.JS的核心库“querystring library”

If your code relies heavily on data structures where the possibility for collisions( 碰撞 ) like the exist, you might want to consider having a "has" utility around:

###### 如果代码里大量的使用了javscript对象数据结构且要经常去判断是否存在某属性，你应该考虑封装一个下面的方法：

	function has( obj, key ) {    
		
		return Object.prototype.hasOwnproperty.call( obj, key ); 
		
	}

And use it as follows:

###### 像如下般使用：

	if ( has( posts, req.body.slug ) ) {}

As a side note, you should generally stick to( 坚持 ) this method in the browser enviroment as well. Host object such as "window" in older internet Explorer versions do not have "hasOwnProperty", 
leading to( 导致 ) potentially( 潜在 ) inconsistent( 不一致 ) behavior in your code.

###### 应该要坚持在浏览器环境中使用这个方法。在旧的IE浏览器中，一些对象如window是没有"hasOwnProperty"方法，可能会导致代码表现不一致。

As correctlly pointed out by different comments and tweets, another possibility surfaces( 表面 ) in Node.JS

###### 有些评论及tweets提到，有另一个正确的方法可以解决，但是在Node.Js环境下。

	var posts = Object.create( null );

This will yield( 产生 ) an object with an null property, which therefore does not inheritany( 继承 ) methods, and would simplify our code to look like the original example:

###### 上面的代码会产生一个javascript对象，没有任何属性。因此不继承方法，这样我们就可以简单的使用下面的代码：
	
	if ( !posts[ req.body.slug ] ) {}

Finally, a hashing scheme( 格式 ) such as a prefix( 前缀 ) could do the job as well:

###### 最后，其实给key值加一个前缀，会靠谱很多

	if ( !posts[ 'posts-'+ req.body.slug ] ) {
		posts[ 'posts-'+ req.body.slug ] = new Post( req.body ); 
	}

