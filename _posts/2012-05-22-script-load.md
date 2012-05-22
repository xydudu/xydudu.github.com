---

title: 关于脚本加载的一些事[高性能javascript读书笔记]
date: 2012-05-22
layout: default

---

###defer属性

HTML 4 为 script 标签定义了 defer 属性，指明了该元素所含的脚本不会修改DOM，因此代码能够安全的延迟执行。也就是说页面解析到该script标签后，会立即下载，但是不会执行，而是等到DOM加载完成（onload事件触发时）再执行。它不会阻塞其它元素的加载。

但是defer属性只支持 **IE4+** and **Firfox 3.5+**，其它浏览器则直接忽略defer属性。


###动态加载脚本

{% highlight javascript linenos %}
	var script = document.createElement(''script);
	script.type = "text/javascript";
	script.src = "file.js";
	document.getElementsByTagName("head")[0].appendChild(script);
{% endhighlight %}

Firefox, Opera, Chrome，Safari 3+ 在file.js加载完后会触发 **onload** 事件。

IE则是触发 **onreadystatechange** 事件，然后检测 script.readyState 的值。readyState有5个状态，但是通常我们只需要检测到：loaded 与 complete 任意一个值，便可断定 file.js 已加载完。然后你需要把 readystatechange 事件清除掉，设置为 null，否则可能会执行多次。

动态加载多个脚本时会遇到较烦的问题就是文件的执行顺序，比如现有：a.js, b.js, c.js 三个文件，b.js 需要用到 a.js 的API，c.js 需要用到 b.js 的API，此时你用动态加载方法加载三个文件，如：

{% highlight javascript linenos %}
	loadScript("a.js");
	loadScript("b.js");
	loadScript("c.js");
{% endhighlight %}	

这三个文件的执行顺序只在 Firefox 与 Opera 中是按你指定的顺序执行的，而其它的浏览器中，这个执行顺序是按文件加载完成的时间来执行的，这就不可控了。所以动态加载多个文件最好的解决办法便是把三个文件按顺序合并为一个文件。

使用XMLHttpRequest动态获取一个脚本文件，然后写入 script.text 中，这也是一种无阻塞加载脚本的方法，且这个方法可以很好的控制其执行时间，但是由于此方法不能在跨域的情况下使用，所以基本上就放弃了。
