///<reference path="./typings/node/node.d.ts"/>
var http = require('http');
var port=process.env.port || 7000;
console.log('listen port: '+port);

http.createServer((request: any, response: any) => {

    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('Hello World');

}).listen(port);
