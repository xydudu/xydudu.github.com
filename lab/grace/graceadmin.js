//12.29/2010 xydudu
//
(function($doc) {

    var iframe = $doc.createElement('iframe');
    iframe.id = 'grace-admin-iframe';
    $doc.body.appendChild(iframe);

    var w, h, x0, y0, x1, y1;

    window.graceadmin = function($data) {
        $data = $data[0]; 
        if($data.url == '') return ;
        var wh = $data.screen.split(',');
        iframe.width = wh[0];
        iframe.height = h = wh[1];
        iframe.style.scroll = 'auto';
        iframe.src = $data.url +'#graceadmin'; 

        showBG();
        cover($data.coordinate);

        var info =div('grace-info', {
            top: 0,
            position: 'fixed',
            right: 0,
            width: 200 +'px',
            backgroundColor: '#000',
            color: '#fff'
        });
        
        info.innerHTML = 'Browser: '+ $data.agent +
            '<br />description: '+ $data.description;


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
            width: '100%',
            height: '100%',
            zIndex: '900',
            opacity: 0
        });
    
    }

    function cover($pot) {
        var 
        pot = $pot.split(','),
        cover = div('grace-cover', {
            position: 'absolute',
            backgroundColor: 'gray',
            left: pot[0] +'px',
            top: pot[1] +'px',
            width: +pot[2] - pot[0] +'px',
            height: +pot[3] - pot[1] +'px',
            zIndex: '901',
            color: 'red',
            opacity: 0.5
        });
        cover.innerHTML = '<span style="opacity:1">here is the bug!!!</span>';

        (pot[3] > h) && (iframe.height = +pot[3] + 100 +'px'); 
    
    }
})(window.document);
