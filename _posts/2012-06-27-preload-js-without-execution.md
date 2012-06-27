---
title: Preload CSS/Javascript without execution [read and translate]
layout: default
---

Preloading components in advance is good for performance. There are several ways to do it. But even the cleanest solution (open up an iframe and go crazy there) comes at a price - the price of the iframe and the price of parsing and executing the preload CSS and Javascript. There's also a relatively high risk( 风险 ) of potential( 潜在 ) Javascript errors if the script you preload assumes it's loaded in a page different than the one that preloads.

提前预加载一些组件对性能是非常有好处的，这里有一些方法来实现预加载：[The art and craft of postload preloads](http://www.phpied.com/the-art-and-craft-of-postload-preloads/)。但是就算是最干净的方法（如利用iframe预加载）都是要额外付出一些性能损耗代价的：创建iframe要影响性能，解析与执行预加载的CSS与Javascript都是耗性能的。还有一个潜在的风险会导致Javascript错误，如果一个页面预加载的脚本与页面希望的不同。

After a bit of trial( 努力，试验 ) and lot of error I think I came up with something that could work cross browser:

经过不懈的努力，我想我想出了一些东西可以工作于各种浏览器中：

- in IE use new Image().src to preload all component types
- in all other browsers use dynamic <object> tag

## Code and demo

Here's the final solution, below are some details.

下面是最终解决方法。

In this example I assume the page prefetches after onload some components that will be needed by the next page. The components are a CSS, a JS and a PNG(sprite).

例子中假定页面加载完成后预加载一些下一个页面需要的组件，这些组件包括CSS, JS 和 PNG。

	window.onload = function() {
	    var 
	    i = 0,
	    max = 0,
	    o = null,
	    
	    // List of stuff to preload
	    preload = [
	        'http://yourwebsite/a.png',
	        'http://yourwebsite/b.js',
	        'http://yourwebsite/c.css'
	    ],
	    isIE = navigator.appName.indexOf('Microsoft') === 0;
	    
	    for (i = 0, max = preload.length; i < max; i += 1) {
	        if (isIE) {
	            new Image().src = preload[i];
	            continue;
	        }
	        o = document.createElement('object');
	        o.data = preload[i];
	        o.width = 0;
	        o.height = 0;
	        
	        //FF 需要 append to head
	        document.body.appendChild(o);
	    }
	};
	
## Comments

- new Image().src doesn't do the job in FF because it has a separate cache for images. Didn't seem to work in safari either where CSS and JS were requested on the second page where they should've been cached
- new Image().src 在FF下不会正常的工作，因为其对images有单独的缓存机制。同样的好像也不在safari中工作，第二个页面中请求的CSS与JS并没有被缓存。
- the dynamic *object* element has to be outside the *head* in most browser in order to fire off the downloads
- 在大多数浏览器中动态插入页面的 *object* 标签必须放在 *head* 之外，以便启动下载。
- dynamic *object* works also in IE7,8 with a few tweaks( 调整 )(commented out in the code above) but not in IE6. In a separate tests I've also found the object element to be expensive in IE in general
- 利用 *object* 预加载同样可以在 IE7,8上工作，但是很耗性能。

That's about it. Below are some unsuccessful attempts I tried which failed for various(各种各样) reasons in different browsers.

就是这样，下面是我的一些不成功的尝试，不同的浏览器不同的失败原因。

## Other unsuccessful attempts

1. I was actually inspired( 鼓舞 ) by [this post by Ben Cherry](http://www.adequatelygood.com/2010/1/Preloading-JS-and-CSS-as-Print-Stylesheets) where he loads CSS and JS in a print stylesheet. Clever hack, unfortunately didn't work in Chrome which caches the JS but doesn't execute it on the next page.

我非常喜欢Ben Cherry文章中提到的利用 print stylesheet 来加载JS与CSS。不辛的是，这个在chrome下是不工作的。

2. One of the comments on Ben's post suggested (Philip and Dejan said the same) using invalid( 无效 ) *type* attribute to prevent execution, e.g *text/cache*
	
	var s = document.createElement('script');
	s.src = preload[1];
	s.type = 'type/cache';
	document.getElementsByTagName('head')[0].appendChild(s);

That worked for the most parts but not in FF3.6 where the Javascript was never requested.

利用无效的type来达到预加载而不执行，适用于大多数的情况，但是FF3.6中将不会发起任何请求。

3. A dynamic link 'prefetch' didn't do anything, not even in FF which is probably the only browser that support this.

## In conclusion

I believe this is a solution I could be comfortable with, although it involves( 包含 ) user agent sniffing( 嗅探 ). It certainly looks less hacky than loading JS as CSS anyways. And object elements are meant( 意味，打算 ) to load any type of component so no semantic( 语义的 ) conflict( 冲突 ) here I don't believe. Feel free to test and report any edge cases or browser/OS combos. (JS errors in IE on the second page are ok, because I'm using console.log in the preloaded javascript)

我相信这是一个能让我觉得舒服的解决方法，尽管它需要用到浏览器嗅探。这显然比用加载CSS的方式来加载JS要少些折腾。另外利用object也能避免一些语义上的冲突。 