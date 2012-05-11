date: 2012-05-11
title: the Performance Golden Rule
layout: default

---

Yesterday I did a workshop（专题学术讨论会之类的） at Google Ventures for some of their portfolio( 投资相关 ) companies. I didn't know how much performance background the audience( 观众 ) would have, so i did an overview of everything performance-related starting with my first presentation back in 2007. It was very nostalgic( 怀旧的 ). It has been years since I talked about the best practices( 做法 ) from [High Performance Web Sites](http://stevesouders.com/hpws/). I reviewed some of those early tips, like
[Make Fewer HTTP Request](http://developer.yahoo.com/blogs/ydn/posts/2007/04/rule_1_make_few/), [Add an Expires Header](http://developer.yahoo.com/blogs/ydn/posts/2007/05/high_performanc_2/), and [Gzip Components](http://developer.yahoo.com/blogs/ydn/posts/2007/07/high_performanc_3/).

昨天我参加了Google Ventures面对投资相关公司的讨论会。我不知道这些参会者遇到多少性能有关的问题，所以我做了一个我之前所有与性能相关讲稿的概括，这是一件很怀旧的事。距离我讲的 High Performance Web Site 已过了蛮久了。我重新看了相关的一些文章，比如：[Make Fewer HTTP Request](http://developer.yahoo.com/blogs/ydn/posts/2007/04/rule_1_make_few/), [Add an Expires Header](http://developer.yahoo.com/blogs/ydn/posts/2007/05/high_performanc_2/), and [Gzip Components](http://developer.yahoo.com/blogs/ydn/posts/2007/07/high_performanc_3/)。

But I needed to go back even further. Thinking back to before Velocity and WPO existed, I thought I might have to clarify( 搞清楚 ) why I focus mostly on frontend performance optimizations( 优化 ). I found my slides that explained the Performance Golden Rule:

但是我需要往回看更远，思考在Velocity和WPO存在之前，我想我必须搞清楚为什么我专注于前端性能优化。我找到了我的一些slides讲述了性能的黄金规则：

80~90% of the end-user response time is spent on the frontend. (大部分的用户所接受的数据大部分的时间都耗在前端上)
Start there.

There were some associated( 关联 ) slides that showed the backend and frontend times for popular websites, but the data was old and limited, so i decided to update it.
Here are the results.

这些相关的slides显示了一些流行的网站后端与前端所耗时间的对比图，但是这些数据并不是最新的且很有局限性，所以我决定更新一下这些数据，下面是结果:

First is an example waterfall showing the backend/frontend split. This waterfall is for LinkedIn. The 'backend' time is the time it takes the server to get the first byte back to the client. This typically( 类型 ) includes the bulk( 体积 ) of backend processing: database lookups, remote web service calls, stitching( 拼接 ) together HTML, etc.

首先的例子是一个分离显示前端与后端的瀑布图， 这张瀑布图来源于 linkedIn 的采样数据。 后端时间是从服务器取得并返回到客户端第一个字节的时间。这包括几个类型的时间： 查询数据库，请求远程服务器，拼接HTML并返回。

The 'frontend' time is everything else. This includes obvious( 明显 ) frontend phases( 阶段 ) like executing Javascript and rendering the page. It also includes network time for downloading all the resources referenced( 被引用 ) in the page. I include this in the frontend time because there is a great deal( a great deal 大量的 ) web deverlopers can do to reduce the time, such as [async script loading](http://www.stevesouders.com/blog/2009/04/27/loading-scripts-without-blocking/), [concatenating scripts and stylesheets](http://developer.yahoo.com/blogs/ydn/posts/2007/04/rule_1_make_few/), and [sharding domains](http://www.stevesouders.com/blog/2009/05/12/sharding-dominant-domains/).

其它所耗的时间则全部是前端时间。这包括几个较明显的阶段，如：Javascript执行时间，页面渲染时间。同进它也包括了一些耗在网络上的时间，如：下载所有的在页面中被引用的资源。我把这个算在前端时间中，是因为大量的前端开发者能够有效的减少耗在这个上面的时间，比如：异步加载脚本，合并脚本与样式，使用二级域名。

![LinkedIn waterfall](http://stevesouders.com/images/golden-waterfall.png)

For some real results I look at the frontend/backend split for Top 10 websites. The average frontend time is 76%, slightly( 略 ) lower than the 80 ~ 90% advertised( 公布在 ) in the Performance Golden Rule. But remember that these sites have highly optimized frontends, and two of them are search pages( not results ) that have very few resources.

分析访问量最大的10个网站的真实数据，平均耗在前端的时间占 76%，略小于性能黄金规则所提的 80 ~ 90%。但是记住这些网站都是经常非常多前端性化的，而且其实两个站还是搜索页，这是不包括什么脚本之类的资源的。

![Top 10](http://stevesouders.com/images/golden-top10.png)

For a more typical view I looked at 10 sites ranked( 排名 ) around 10,000. The fronted time is 92%, highly than the 76% of the Top 10 sites and even higher than the 80 ~ 90 suggested by the Performance Golden Rule.

为了列客观与普通，我在排名10,000间随机挑了10个网站来测试，这些网站耗在前端的时间平均在 92%，这高于排名前10网站的 76%，也高于性能黄金规则建议的 80 ~ 90%。

![rank around 10000](http://stevesouders.com/images/golden-9990.png)

To bring this rule home to the attendees( 与会者 ) I showed the backend and frontend times for their websites. The frontend time was 84%. This helped me get their agreement that the longeest pole( 极 ) in the tent( 帐篷 ) was frontend performance and that was the place to focus.

为了让与会者对规则感受更深，我展示了参会者自己的10个网站耗时数据，它们的前端时间平均占 84%。这帮助我与他们达成了共识，就是前端的性能就是提升网站性能的关键，这就是我们要关注的地方。

![startups](http://stevesouders.com/images/golden-startups.png)

Afterward( 后来 ) I realized that I have timing infomation in the [HTTP Archive](http://httparchive.org/). I generally don't show these time measurements( 测量 ) because I think real user metrics( 度量 ) are more accurate( 准确 ), but I calculated( 计算 ) the split across all 50,000 websites that are being crawled( 爬 ). The frontend time is 87%.

后来我认识到我可以利用 http://httparchive.org/ 来收集时间信息，通常我不展示从这里采集过来的数据，因为我觉得这样的测量没有真实的人们访问所得数据准确。当然，我还是计算了利用http://httparchive.org/收集页来的50,000个网站的数据，并得到前端时间是 87%.

![top 50K](http://stevesouders.com/images/golden-top50K.png)

It's great to have this updated information that shows the Performance Golden Rule is as accurate now as it was back in 2007, and points to the motivation( 动机 ) for focusing of frentend optimizations. if you're worried about availability and scalability( 可扩展性 ), focus on the backend. But if you are worried about how long users are waiting for your website to load focusing on the frontend is your best bet.

总之就是花更多的精力关注前端所耗的时间吧，并想尽办法去优化它们。