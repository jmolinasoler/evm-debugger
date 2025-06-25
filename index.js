 const http = require('http');
 const debugController = require('./controllers/debugController');

 const SERVER_PORT = 3000;

// Create the HTTP server and act as a simple router
const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    debugController.showDebugInfo(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(SERVER_PORT, () => {
  console.log(`Anvil Debugger server running at http://localhost:${SERVER_PORT}`);
  console.log('Visit the URL in your browser to get the latest Anvil debug info.');
  console.log('Refresh the page to get updated information.');
});