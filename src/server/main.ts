///<reference path="./typings/node/node.d.ts"/>
///<reference path="./HelloWorld.ts"/>

var nodeStatic = require('node-static');
var port = 8000;
var http = require('http');
var port: number=process.env.port || 7000;
console.log('listen port: '+port);

var file = new nodeStatic.Server('./client');
http.createServer((request: any, response: any) => {

    var hello = new Hello();
    hello.log();

    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
    
}).listen(port);
