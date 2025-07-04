 const express = require('express');
 const routes = require('./routes');

 const app = express();
 const SERVER_PORT = 3000;

// Use the router for all incoming requests
app.use('/', routes);

app.listen(SERVER_PORT, () => {
  console.log(`Anvil Debugger server running at http://localhost:${SERVER_PORT}`);
  console.log('Visit the URL in your browser to get the latest Anvil debug info.');
  console.log('Refresh the page to get updated information.');
});