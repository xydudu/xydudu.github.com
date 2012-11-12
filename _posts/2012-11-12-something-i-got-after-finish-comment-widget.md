---

date: 2012-11-12
title: 做完公司公共评论组件后一些记录
layout: default

---

其实之前做了一个版本的评论，也基本上是较独立的，能方便的在各个项目中进行调用。但不足的地方有下面几点：

1. 数据没有json化，很多的HTML在接口中传递，这太浪费流量与速度了
2. 由上一点导致，模板与数据没有分离，这样要定制一些模块就不是很方便
3. css 需要另外在页面中载入，我希望css能在组件中自己引入进来

要较好的完成这样一个组件，需要解决的一些难点

## 与后端接口通信，涉及到跨域问题

接口有读与取两种类型的需要，读数据用jsonp能解决掉跨域，跨浏览器的问题。但是写数据时，用get方式似乎不太稳妥，当然，如果后端能够能好的解决这样的安全性问题，其实写接口也用jsonp来与客户端通信也是很好的，这样的话，就能省不少的事了。

当然，最终我还是放弃了尝试把写接口也用jsonp来进行。于是寻找一种靠谱的方式让客户端post数据到API接口，并取得API接口返回的操作结果数据，让我花了一天的时间来测试。

其实网络上已有许多成熟的方案了。当然，像利用flash来跨域通信的方式，我是肯定不会考虑的，首先我不喜欢flash，其次，我也不想在这么一个组件里引入太多外界的代码。

然后我也不想后端需要太多的修改，比如添加什么 crossdomain.xml, 修改 Access-Control-Allow-Origin 等等，用这些虽然能给前端代码省不少事，但是后面的维护会很坑爹。这种白名单式的方法，让我想到每个不同域项目调用了评论组件，就得要我在后端添加一个名单，我岂不是会疯了克？

抛弃上面些些方法，我决定还是回归最简单，最纯粹的方式。要post数据，我就构建一个表单来post吧。这样单纯的方法，ie6也不会拒绝的。当然这里会有一个问题，如果直接让form到action，我什么也不做，那太幼稚了。我是个成熟的人，所以这里把form的target的值设定为一个iframe的name。嗯，相信很多人都能明白，这样表单提交的目标成了iframe，form提交结果也只在那个可怜的iframe中出现，页面就不会跳转了，整个就像不会刷新，有种高科技的感觉。

对了，这些显然要隐藏掉，就像客户端与服务器密密的小勾当一样，不能被可爱的用户们见到。你肯定能想像得到别人调用了你写的评论组件，好好的页面中出现一个傻傻的空白iframe，他们会是如何的激动，然后在脑中咒骂你千万次。所以一定要记得iframe要display:none。

{% highlight javascript linenos %}
		
		var iframe = $('<iframe '
                + 'frameborder="0" '
                + 'height="0" '
                + 'name="'+ id +'" '
                + 'id="'+ id +'" '
                + 'width="0"/>')
            .appendTo('body')
        , form = $('<form />')
            .attr({
                action: api +'/comment/post',
                target: id,
                method: 'POST'
            })
            .appendTo('body')
        , hiddens = {}
                
        $.each({
            type: _.type,
            subject_id: _.subject,
            content: '',
            fid: 0,
            mood: 0,
            method: 'post',
            url: current_url,
            comment_id: 0
        }, function(_name, _value) {
            hiddens[_name] = $('<input />')
                .attr({
                    type: 'hidden',
                    name: _name,
                    value: _value
                }).appendTo(form)
        })
 
 {% endhighlight %}

        
 好吧，我竟然把代码贴出来了。这显得我太有诚意了，但是这只是一个片段，很显然的功能就是构建一个ifram与一个form，插入body中。当然，可怜的form中还被插了许多的type=hidden的input，这些都是一些必要的参数，如果你想借鉴这一些代码，千万记住有些代码你是需要修改的。
 
 上面的代码如果仔细看的话，还会有少许的疑惑。iframe与form的构建方式，为何要不同呢？当然可以写成一样的，比如form也可以像iframe一般 $('<form>把里面的东西一股脑全塞在这</form>')。但是这种方式不好看，你看现在我构建form的方式是多么的美丽。
 
 哈，那为何iframe那是那么丑陋的方式来写呢？嗯，恭喜你，因为这里有一个坑。在ie6下，利用javascript动态插入的iframe，属性很容易broken，这算是一个bug。解决方式就是你最好把整个iframe一次性的插入页面中，或者需要的时候（比如在提交表单时）检查一下iframe的name是否与你预想中的一样，不同的话，再指定一次name。
 
 关于上面的坑，你应该会很有兴趣阅读一下这个帖子：[IE form target broken when using DOM/AJAX](http://forums.digitalpoint.com/showthread.php?t=107314)
 
 ### 从iframe中取到接口返回的结果
 
 利用form提交数据到隐藏的ifrmae中来提交数据到API，后面一步当然是你得知道提交后的结果，是成功了还是失败了，或者你还需要知道一些其它从服务器传来的信息。
 
 这时候就会发现，同在一个页面中，你明明可以在iframe中看到结果了，你想要用js读到却很是头痛。你就别去想设定document.domain为同一个主域的傻傻方法了，哥这里是要跨主域的。
 
 如果你发现 postMessage 这些牛B而方便的HTML5方法不能使用时，苦恼的心情我非常明白。面对低级ie时，哪个前端不言愁。
 
 考虑来iframe中不论在何域，都是有权限设定主窗口location。那就用这个来通信吧，就像两个面对面但耳朵听不见的可怜人想要谈恋爱，得想办法沟通，写在纸上，这方法虽然不直接，但是也能正常的谈下去。
 
 好了，用科学的语言来讲这个方式，虽然网络上有许多了。从iframe中读取接口返回的数据，步骤说明如下：
 
 1. post 数据到接口时，开启 location.hash 变化的监听器
 2. 后端接口返回时把数据写到父页面的 location.hash 中
 3. 当发现hash有变化时，暂停监听

好了，数据到手。

代码也很简单，分服务端接口输出，以及当前页的监听器

{% highlight javascript linenos %}

		// 监听iframe返回
        var count = 1
        function listenAPI(_fn) {
            _.timer = setInterval(function() {
                var 
                href = window.location.href
                hash = href.split('#')[1]
                hash = decodeURIComponent(hash)
                if (hash && hash.indexOf('err') > 0) {
                    clearInterval(_.timer) 
                    _.timer = null
                    window.location.hash = 'comment--'
                    hash = $.parseJSON(hash)
                    count = 1
                    _fn(hash)
                    return 
                }
                count ++
                if (count > 50) {
                    clearInterval(_.timer) 
                    _.timer = null
                    count = 1
                    alert('timeout')
                }
            }, 200)
        }
		
		// 服务器返回
		
		window.location.hash='{data:...}'
		
{% endhighlight %}

这代码没什么坑，但是千万合理的使用那个监听器，一直在那循环着，对浏览器和用户的机器可不是什么好事。如果不小心把老板的电脑搞死机了，那一定就悲伤成河了。	

## 后面

呃，其实写到这里，我真不知道在写评论组件时，我还有什么需要特别记忆的。因为你把前端与API接口的通信搞清白了，其实其它的东西就任你发挥了。比如我把CSS用JS来载入，这样可爱的写页面的孩子们就不会困惑自己是不是有什么CSS没有在页面中引入。

还有，选用一个方便的前端模板也是很能让这个组件强大的一种方式，比如我选用的是 [mustache](http://mustache.github.com/)，虽然有人说这个的性能的问题，但是还是很好用的。

合理使用 location.hash来跳到对应的item也是需要好好设计一下的功能，在评论被翻页后，如何聚焦到刚回复的评论item。如何在用户分享某条评论链接给别人时，能让快速的取得并聚焦到正确的评论item。



 
 