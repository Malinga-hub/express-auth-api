/* create node server */
const http = require('http');
const app = require('./app');

/* set the port */
const port = process.env.PORT || 3000;

/* create server */
const server = http.createServer(app);

/* listen to port */
server.listen(port);