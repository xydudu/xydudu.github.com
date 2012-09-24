var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  if (req.url.indexOf('iframe')>0) {
      setTimeout(function() {
      
        res.end('<html><script>parent.location.hash = "a=1&b=2&c=3"</script></html>');
      }, 10000)
  } else {
    res.end ('hello...this is a test server ..Lian Hsueh')
  }
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
