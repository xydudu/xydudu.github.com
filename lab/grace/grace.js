//main file
//12.27/2010
(function($doc, undefined) {
    
    if (window.location.hash == '#graceadmin') return;

    var 
    url = 'http://blog.xydudu.com/lab/grace/',
    box = div('grace-trigger', {
        position: 'fixed',
        right: '10px',
        top: '45%'
    }),
    agent = function() {
        var ua = navigator.userAgent,
        m,
        o = {
            webkit: 0,
            chrome: 0,
            safari: 0,
            gecko: 0,
            firefox:  0,
            ie: 0,
            opera: 0
        },
        numberify = function(s) {
            var c = 0;
            // convert '1.2.3.4' to 1.234
            return parseFloat(s.replace(/\./g, function() {
                return (c++ === 0) ? '.' : '';
            }));
        };

        // WebKit
        if ((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {
            //o.webkit = numberify(m[1]);

            // Chrome
            if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
                o.chrome = numberify(m[1]);
            }
            // Safari
            else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
                o.safari = numberify(m[1]);
            }
            
        }
        // NOT WebKit
        else {
            // Opera
            if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
                o.opera = numberify(m[1]);

            // NOT WebKit or Opera
            } else {
                // MSIE
                if ((m = ua.match(/MSIE\s([^;]*)/)) && m[1]) {
                    o.ie = numberify(m[1]);
                // NOT WebKit, Opera or IE
                } else {
                    // Gecko
                    if ((m = ua.match(/Gecko/))) {
                        // Firefox
                        if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                            o.firefox = numberify(m[1]);
                        }
                    }
                }
            }
        }
        for (var k in o) if(o[k]) return k +':'+ o[k];
    }(),
    windowWH = function() {
        var myWidth = 0, myHeight = 0;
        if( typeof( window.innerWidth ) == 'number' ) {
            //Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        }
        return [myWidth, myHeight];
    }();
    
    box.innerHTML  = '<a href="javascript:"><img border="0" src="'+ url +'search.png" alt="find the bug"  title="find the bug"/></a>';
    box.onclick = function($e) {
        
        var e = $e || window.event;
            target = e.target || e.srcElement;
        
        (target.tagName.toLowerCase() == 'img') && showBG();
        
        return false;
    
    };

    function g($id) {
        return $doc.getElementById($id); 
    }

    function div($id, $css) {

        var div = g($id) || $doc.createElement('div');
        div.id = $id;
        for(var k in $css) 
            div.style[k] = $css[k];
        
        div.style.display = 'block';
        $doc.body.appendChild(div);
        return div;
    }

    function showBG() {
        
        var bg = div('grace-bg', {
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: 'gray',
            opacity: 0.8,
            width: '100%',
            height: '100%',
            zIndex: '900',
            cursor: 'crosshair',
            opacity: 0
        });
        
        bg.onmousedown = beginDraw;
        bg.onmouseup = endDraw;
    
    }

    var draw = false,
        x = y = x0 = y0 = x1 = y1 = 0,
        cover;
    function beginDraw($e) {
        g('grace-input') && 
            (g('grace-input').style.display = 'none');

        var e = $e || window.event,
            xy = getXY(e);

        x0 = xy.x;
        y0 = xy.y;
        
        cover = div('grace-cover', {
            position: 'absolute',
            backgroundColor: 'gray',
            left: x0 +'px',
            top: y0 +'px',
            width: '130px',
            height: '22px',
            zIndex: '901',
            color: 'red',
            opacity: 0.5
        });
        cover.innerHTML = '<span style="opacity:1">here is the bug!!!</span>';
        draw = true;
        this.onmousemove = Draw;
        return false; 

    }

    function endDraw($e) {
        var e = $e || window.event,
            xy = getXY(e);

        x1 = xy.x;
        y1 = xy.y;
        
        showInput([x0, y1], [x1 - x0, 100], this);

        this.onmousemove = null;
        cover.onmouseup = cover.onmousedown = null;
        cover.onmousemove = null;

        draw = false;
        return false; 
    }

    function showInput($pos, $wh, $obj) {
    
        var w = $wh[0] > 130 ? $wh[0] : 130,
            input = div('grace-input', {
            position: 'absolute',
            left: $pos[0] +'px',
            top: $pos[1] +'px',
            width: w +'px',
            height: $wh[1] +'px',
            backgroundColor: 'gray',
            zIndex: 901
        });
        //console.log(agent);

        input.innerHTML = 
                    '<form id="grace-form" method="post" target="grace-iframe" action="http://test.990731.com/?c=bug&a=report" >' +
                    '<textarea style="width:'+ (+w-6) +'px" name="description">description</textarea><br />' +
                    '<input type="hidden" value="'+ [x0, y0, x1, y1].join(',') +'" name="coordinate" />' +
                    '<input type="hidden" value="'+ agent +'" name="agent" />' +
                    '<input type="hidden" value="'+ windowWH.join(',') +'" name="screen" />' +
                    '<input type="hidden" value="'+ window.location +'" name="url" />' +
                    '<input type="image" src="'+ url +'y.png" alt="ok" />' +
                    '<input type="image" src="'+ url +'x.png" alt="cancel" />' +
                    '</form>';

        input.onclick = function($e) {
            var e = $e || window.event;
            target = e.target || e.srcElement;
        
            (target.tagName.toLowerCase() == 'input') && 
                    post(target.alt);
            return false;
        };
        
    }

    function post($type) {

        if ($type == 'cancel') cancel(); 

        if ($type == 'ok') {
            var form = g('grace-form'),
                iframe = g('grace-iframe') || $doc.createElement('iframe');
            
            iframe.frameborder = 0;
            iframe.id = 'grace-iframe';
            iframe.name = 'grace-iframe';
            iframe.height = 0;
            iframe.width = 0;
            iframe.style.display = 'none';

            $doc.body.appendChild(iframe);

            form.submit();
            cancel();
            (function() {
                 
                var 
                originurl = window.location,
                t = setTimeout(function() {
                    if (window.location.hash == '#ok') {
                        alert('提交成功了！');
                        clearTimeout(t);
                        window.location = originurl;
                        t.null;
                        return;
                    }
                    if (window.location.hash == '#err') {
                        alert('提交失败了！');
                        window.location = originurl;
                        clearTimeout(t);
                        t.null;
                        return;
                    }
                    t = setTimeout(arguments.callee, 100);
                },100);

            })();
        }

        function cancel() {
            var bg = g('grace-bg'),
                cover = g('grace-cover');
            bg.style.display = 'none'; 
            cover.style.display = 'none';  
            g('grace-input').style.display = 'none';  

            bg.onmousemove = null;
            cover.onmouseup = cover.onmousedown = null;
            cover.onmousemove = null;
        } 
        return false;
    }

    function getXY($e) {
        if($e.pageX || $e.pageY){   
            x1 = $e.pageX;
            y1 = $e.pageY;   
        } else {   
            x1 = $e.clientX + $doc.body.scrollLeft - $doc.body.clientLeft;   
            y1 = $e.clientY + $doc.body.scrollTop  - $doc.body.clientTop;  
        }

        return {x: x1, y: y1};
    }

    function Draw($e) {
        if (!draw || !cover) return false;
        g('grace-input') && 
            (g('grace-input').style.display = 'none');

        var e = $e || window.event,
            xy = getXY(e),
            w = xy.x - x0,
            h = xy.y - y0;

        cover.style.width = (w > 130 ? w : 130) +'px';
        cover.style.height = (h > 22 ? h : 22) +'px';

        cover.onmouseup = cover.onmousedown = endDraw;
        cover.onmousemove = Draw;

        return false; 
    }

})(window.document);
