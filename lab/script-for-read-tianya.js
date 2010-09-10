var 
post, 
div,
s,
posts = document.getElementsByClassName('post'),
divs = document.getElementsByTagName('div'),
text;


for (var i=0,l=divs.length; i<l; i++) {
    div = divs[i];
    if (!div) break;
    if (div.className != 'post') {
        div.style.display = 'none';
    } else {
        //div.style.display = 'block';
        div.style.borderBottom = '5px solid #000';
        div.style.padding = '20px 0';
        div.style.fontSize= '20px';
        
        text = div.innerHTML.replace(/\s+/g, '').replace(/<.*?>/gi, '|');
        text = text.replace(/\|+/g, '<br />');
        div.innerHTML = text; 
        
        document.body.appendChild(div);        
    }   
}

