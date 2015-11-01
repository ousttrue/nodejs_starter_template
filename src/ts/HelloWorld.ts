///<reference path="./typings/node/node.d.ts"/>
//declare function require(x: string): any;

var http = require('http');
var port=process.env.port || 7000;
console.log(port);

http.createServer((request: any, response: any) => {

    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('Hello World');

}).listen(port);
